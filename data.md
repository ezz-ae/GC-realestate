GC-03 UPDATED — v1.1 (Full Media Layer)
=================================================================

  TypeScript file:     lib/types/project.ts
    Lines:             220
    New interfaces:    ProjectMedia · ConstructionUpdate · AreaType · LandmarkType
    Updated:           UnitConfig (+ floorPlan, interiorImage)
                       Developer  (+ logo required, description required)
                       Project    (extends ProjectMedia, + constructionUpdates[])
                       PropertyLite (+ developerLogo, ogImage, archetype)
                       AreaProfile  (+ image required, heroVideo)
                       DeveloperProfile (+ bannerImage, galleryImages)

  API client:          lib/entrestate.ts
    New exports:       MOCK_AREA_PROFILES · MOCK_DEVELOPER_PROFILES
    New fn:            getPropertyLite() → PropertyLite[]

  Codex prompt:        89 lines
    Added:             MEDIA_RULES block (image, video, virtual tour, logos,
                       floor plans, construction updates, area/dev images)

  Media field coverage (sample project: Dubai Marina Residences):
    ✓ heroImage          https://images.unsplash.com/photo-1539635278303-d4002c0...
    ✓ heroVideo          https://www.youtube.com/embed/LXb3EKWsInQ
    ✓ virtualTour        https://my.matterport.com/show/?m=gc0001tour
    ✓ gallery            [12 images]
    ✓ masterplan         https://picsum.photos/seed/mp0/1400/800
    ✓ brochure           https://gc-assets.entrestate.com/brochures/gc_0001_broc...
    ✓ ogImage            https://images.unsplash.com/photo-1539635278303-d4002c0...
    ✓ units[].floorPlan    all 4 units ✓
    - constructionUpdates  0 (completed / no updates)

  ─── CODEX PROMPT ───────────────────────────────────────────────

Repo: https://github.com/ezz-ae/GC-realestate
Data: Neon PostgreSQL (already connected via NEON_DATABASE_URL)

━━━ NEON TABLES (live, query directly) ━━━━━━━━━━━━━━━━━━━━━━━━
  gc_projects           3,655 rows  — full project schema + llm_context
  gc_area_profiles         10 rows  — area images, yields, descriptions
  gc_developer_profiles    64 rows  — logos, track records, honesty index

  Key columns on gc_projects:
    id, name, slug, area, developer_id, developer_name
    status, featured, price_from_aed, price_to_aed
    rental_yield, market_score, risk_class
    golden_visa_eligible, price_tier, handover_date
    archetype, area_type, hero_image, hero_video
    virtual_tour, brochure, og_image, confidence
    payload JSONB  ← full project object (all fields)
    llm_context TEXT  ← pre-formatted for Gemini RAG

━━━ TYPESCRIPT TYPES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  lib/types/project.ts   — Project · PropertyLite · Developer
                           UnitConfig · AreaProfile · DeveloperProfile
                           ConstructionUpdate · ProjectMedia
                           (all interfaces v1.1 — already in repo)

━━━ DATA ACCESS PATTERN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- Fast card grid (indexed columns only)
  SELECT id, name, slug, area, developer_name, featured,
         price_from_aed, rental_yield, market_score,
         risk_class, golden_visa_eligible, price_tier,
         handover_date, hero_image, og_image
  FROM gc_projects
  WHERE status = 'selling'
  ORDER BY market_score DESC
  LIMIT 50;

  -- Full project page
  SELECT payload FROM gc_projects WHERE slug = $1;

  -- AI chat context (Gemini RAG)
  SELECT llm_context FROM gc_projects
  WHERE area = $1 ORDER BY market_score DESC LIMIT 10;

  -- Area hub
  SELECT * FROM gc_area_profiles ORDER BY avg_yield DESC;

  -- Developer page
  SELECT payload FROM gc_developer_profiles WHERE slug = $1;

━━━ BUSINESS RULES (never hardcode) ━━━━━━━━━━━━━━━━━━━━━━━━━━
  goldenVisaEligible  = price_from_aed >= 2_000_000
  riskDiscount badge  = developer.riskDiscount === true
    (Emaar · DAMAC · Nakheel · Meraas · Aldar · Sobha ·
     Azizi · Binghatti · Dubai Properties · NSHAMA · Danube)
  marketScore badge:
    >= 80 → "Strong"  (green)
    65–79 → "Good"    (gold)
    <  65 → "Standard"(gray)
  Price display:
    AED: Intl.NumberFormat('en-AE', {style:'currency', currency:'AED', maximumFractionDigits:0})
    USD: aed × 0.2723

━━━ MEDIA FIELDS (all populated in DB) ━━━━━━━━━━━━━━━━━━━━━━━
  hero_image    → <Image priority size="100vw"> above fold
  gallery[]     → lightbox, lazy load all except [0]
  hero_video    → YouTube embed, aspect-video, loading="lazy"
  virtual_tour  → Matterport iframe, xr-spatial-tracking
  brochure      → <a href download target="_blank">
  og_image      → <meta property="og:image"> absolute URL
  developer.logo → <Image object-contain> + onError fallback
  units[].floorPlan → modal/drawer on unit click
  constructionUpdates[] → vertical timeline, only if length > 0

━━━ ENV VARS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEON_DATABASE_URL        (already set)
  GEMINI_API_KEY           (for AI chat)
  NEXT_PUBLIC_BASE_URL     https://goldcentury.ae

━━━ DESIGN TOKENS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  gold:     #C9A961 → #B8860B  (gradient — CTA, headings, badges)
  dark bg:  #1C1C1E  (NOT #000000)
  card:     #2C2C2E dark / #FFFFFF light
  headings: Playfair Display · body: Inter / Geist

━━━ AI CHAT RULES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Inject llm_context rows into Gemini system prompt
  - All yield/ROI outputs: "projected" / "estimated" — never exact
  - Footer attribution: "Data: Entrestate Intelligence"
  - Golden Visa filter: WHERE golden_visa_eligible = true

    - Risk class filter: WHERE risk_class IN ('low', 'medium')
    - Price tier filter: WHERE price_tier = 'luxury'
    - Handover date filter: WHERE handover_date >= CURRENT_DATE
    - Area type filter: WHERE area_type = 'beachfront'
    - Developer filter: WHERE developer_name = 'Emaar'
     