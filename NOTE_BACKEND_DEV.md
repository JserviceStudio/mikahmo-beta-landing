<AGENT_TASK>
  <ROLE>Backend Systems Engineer</ROLE>
  <CONTEXT>
    Frontend client (MikahmoAI Beta Landing Page + MikhmoAI Store) requires backend REST API endpoints for data persistence and catalog retrieval.
    Host: Hostinger.
  </CONTEXT>

  <SPECIFICATIONS>
    <SPEC id="beta-registration">
      <ACTION>Store beta tester leads</ACTION>
      <ENDPOINT>POST /api/beta/register</ENDPOINT>
      <AUTH>None</AUTH>
      <PAYLOAD format="json">
        { "email": "string(unique)", "whatsapp": "string" }
      </PAYLOAD>
      <RESPONSES>
        <RES code="201">Success</RES>
        <RES code="400">Invalid payload format</RES>
        <RES code="409">Email already exists</RES>
        <RES code="500">Internal Server Error</RES>
      </RESPONSES>
      <DB_SCHEMA_REQUIREMENT>
        Table `beta_subscribers` (id PK, email UNIQUE NOT NULL, whatsapp NOT NULL, created_at DATETIME)
      </DB_SCHEMA_REQUIREMENT>
    </SPEC>

    <SPEC id="beta-export">
      <ACTION>Export beta leads for Admin</ACTION>
      <ENDPOINT>GET /api/beta/export</ENDPOINT>
      <AUTH>Required (Header/Token to define)</AUTH>
      <RESPONSES>
        <RES code="200" format="csv">ID, Email, WhatsApp, Date</RES>
      </RESPONSES>
    </SPEC>

    <SPEC id="store-catalog">
      <ACTION>Serve catalog data to MikhmoAI Store frontend</ACTION>
      <ENDPOINT>GET /api/store/catalog</ENDPOINT>
      <AUTH>None</AUTH>
      <REQUIREMENTS>
        Must return the 5 current mobile application licenses and available third-party integrations (VPN, Radius).
      </REQUIREMENTS>
      <RESPONSES>
        <RES code="200" format="json">
          {
            "items": [
              {
                "id": "string",
                "type": "ENUM(LICENSE|VPN|RADIUS|VOUCHER)",
                "name": "string",
                "price": "number",
                "currency": "string",
                "marketing_desc": "string",
                "features_limits": ["string"]
              }
            ]
          }
        </RES>
      </RESPONSES>
    </SPEC>

    <SPEC id="checkout-session">
      <ACTION>Generate checkout links and handle purchasing options</ACTION>
      <ENDPOINT>POST /api/store/checkout</ENDPOINT>
      <AUTH>Required (Bearer Token)</AUTH>
      <PAYLOAD format="json">
        {
          "product_id": "string",
          "coupon_code": "string(optional)",
          "referral_code": "string(optional)",
          "payment_method": "ENUM(STRIPE|PAYPAL|CRYPTO|MOBILE_MONEY)"
        }
      </PAYLOAD>
      <RESPONSES>
        <RES code="200" format="json">{ "checkout_url": "string", "session_id": "string", "final_price": "number" }</RES>
        <RES code="404">Product or Coupon not found</RES>
      </RESPONSES>
    </SPEC>

    <SPEC id="apply-discount">
      <ACTION>Validate discount plans and coupons</ACTION>
      <ENDPOINT>POST /api/store/discount/validate</ENDPOINT>
      <AUTH>None</AUTH>
      <PAYLOAD format="json">
        { "code": "string", "product_id": "string", "type": "ENUM(COUPON|REFERRAL)" }
      </PAYLOAD>
      <RESPONSES>
        <RES code="200" format="json">{ "valid": true, "discount_pct": "number", "new_price": "number" }</RES>
        <RES code="400">Invalid or expired code</RES>
      </RESPONSES>
    </SPEC>

    <SPEC id="referral-program">
      <ACTION>Retrieve affiliate/referral program stats</ACTION>
      <ENDPOINT>GET /api/user/referral</ENDPOINT>
      <AUTH>Required (Bearer Token)</AUTH>
      <RESPONSES>
        <RES code="200" format="json">
          { "referral_code": "string", "referral_link": "string", "total_earnings": "number", "referred_users": "number" }
        </RES>
      </RESPONSES>
    </SPEC>

    <SPEC id="claim-license">
      <ACTION>Provision and claim purchased licenses or VPN/RADIUS services</ACTION>
      <ENDPOINT>POST /api/store/licenses/claim</ENDPOINT>
      <AUTH>Required (Bearer Token)</AUTH>
      <PAYLOAD format="json">
        { "session_id": "string", "target_router_id": "string(optional)" }
      </PAYLOAD>
      <RESPONSES>
        <RES code="200" format="json">{ "license_key": "string", "status": "ACTIVE", "expires_at": "datetime", "provisioning_data": "json" }</RES>
        <RES code="402">Payment verification pending/failed</RES>
        <RES code="409">License already claimed</RES>
      </RESPONSES>
    </SPEC>
  </SPECIFICATIONS>

  <INFRASTRUCTURE_CONTRACT>
    <ENV_OUTPUT_REQUIRED>
      - NEXT_PUBLIC_API_BASE_URL
      - API_SECRET_KEY
    </ENV_OUTPUT_REQUIRED>
    <CORS_POLICY>
      - Allowed Origins: Frontend production domains (TBD, e.g., https://beta.mikhmoai.com)
      - Allowed Methods: POST, GET, OPTIONS
      - Allowed Headers: Content-Type, Authorization
    </CORS_POLICY>
  </INFRASTRUCTURE_CONTRACT>

  <EXECUTION_TRIGGER>
    Once endpoints are live and tested, provide ENV_OUTPUT_REQUIRED to Frontend Agent to swap local SQLite dependencies with remote fetch calls.
  </EXECUTION_TRIGGER>

  <FRONTEND_INTEGRATION_STATUS date="2026-06-19">
    <SUMMARY>
      Le front-end (Store et Landing Page) a été mis à jour et est prêt à consommer l'API de production.
      L'interface "Claim License" (activation) a été intégrée directement dans le StoreUI avec une structure optimisée pour mobile-first.
    </SUMMARY>
    
    <IMPLEMENTED_FEATURES>
      - GET /api/store/catalog : Récupération dynamique du catalogue. La carte "MikhmoAI Pro (Trial 30j)" est automatiquement masquée par le front-end.
      - POST /api/store/licenses/claim : Formulaire d'activation de licence intégré au Store (Clé + Email).
      - Design & Branding : Utilisation du logo officiel, compte à rebours dynamique pour les promotions.
    </IMPLEMENTED_FEATURES>

    <MISSING_OPTIONS_REQUESTED>
      Pour que le front-end soit 100% autonome et dynamique, voici les ajustements recommandés côté Backend :
      
      1. Tarification Dynamique (Discounts) :
         - Actuellement, le front-end simule un faux prix barré (+35%). 
         - ACTION: Ajouter un champ `old_price` ou `original_price` dans la réponse de GET /api/store/catalog. Si présent, le front calculera automatiquement la vraie réduction.
      
      2. Authentification "Claim License" :
         - Actuellement, le front-end envoie un token statique (`Authorization: Bearer placeholder_token`).
         - ACTION: Confirmer le mécanisme de session/auth final (Firebase/Supabase ?) pour injecter le vrai token avant le lancement en production.
      
      3. Validation du JSON "Claim" :
         - Le payload actuel envoyé est `{ "license_key": "xxx", "email": "xxx" }`. 
         - ACTION: Vérifier si le backend s'attend strictement à cela ou s'il nécessite `session_id` ou `target_router_id` comme défini dans le SPEC initial. Si oui, merci d'adapter ou de nous notifier.

      4. Erreur réseau (Network Error) sur le bouton de paiement :
         - En production, les utilisateurs obtiennent une "Network error" en cliquant sur "Buy Now" ou "Claim Offer".
         - CAUSE: Le front-end fait un appel vers `POST /api/store/checkout` (comme défini dans la SPEC `checkout-session`) pour récupérer l'URL de votre hub d'achat. Actuellement, cet endpoint ne répond pas (ou n'est pas déployé/bloqué par CORS), ce qui fait crasher le parseur JSON.
         - ACTION: Implémenter l'endpoint `/api/store/checkout` pour qu'il retourne bien `{ "checkout_url": "URL_DU_HUB_DACHAT_STRIPE_OU_FEDAPAY" }`. Assurez-vous aussi que la variable `NEXT_PUBLIC_API_BASE_URL` pointe bien vers le serveur de production.
    </MISSING_OPTIONS_REQUESTED>
  </FRONTEND_INTEGRATION_STATUS>
</AGENT_TASK>
