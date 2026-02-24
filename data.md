
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

  -- Fast card grid
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

  -- ⚠️  BEDROOM + AREA + PRICE filter (AI chat — USE THIS PATTERN)
  -- Example: "2BR in Dubai Marina under AED 2M"
  SELECT name, area, developer_name, price_from_aed,
         hero_image, market_score, rental_yield, payload
  FROM gc_projects
  WHERE area ILIKE '%Dubai Marina%'
    AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(payload->'units') u
        WHERE (u->>'bedrooms')::int = 2          -- 0=studio 1=1BR 2=2BR 3=3BR 4=4BR/penthouse
          AND (u->>'priceFrom')::int < 2000000
    )
  ORDER BY market_score DESC
  LIMIT 20;

  -- Studio filter example
  WHERE EXISTS (
      SELECT 1 FROM jsonb_array_elements(payload->'units') u
      WHERE (u->>'bedrooms')::int = 0
        AND (u->>'priceFrom')::int < 800000
  )

  -- Golden Visa eligible 2BR
  WHERE golden_visa_eligible = true
    AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(payload->'units') u
        WHERE (u->>'bedrooms')::int = 2
    )

  -- Area search (always use ILIKE for area names)
  WHERE area ILIKE '%marina%'        -- Dubai Marina
  WHERE area ILIKE '%JVC%'           -- Jumeirah Village Circle
  WHERE area ILIKE '%downtown%'      -- Downtown Dubai
  WHERE area ILIKE '%business bay%'  -- Business Bay
  WHERE area ILIKE '%palm%'          -- Palm Jumeirah
  WHERE area ILIKE '%marjan%'        -- Al Marjan Island (RAK)
  WHERE area ILIKE '%yas%'           -- Yas Island (Abu Dhabi)
  WHERE area ILIKE '%reem%'          -- Al Reem Island (Abu Dhabi)

  -- City filter
  WHERE payload->>'city' = 'Dubai'
  WHERE payload->>'city' = 'Abu Dhabi'
  WHERE payload->>'city' = 'Ras Al Khaimah'

  -- AI chat context (Gemini RAG)
  SELECT llm_context FROM gc_projects
  WHERE area ILIKE $1 ORDER BY market_score DESC LIMIT 10;

  -- Area hub
  SELECT * FROM gc_area_profiles ORDER BY avg_yield DESC;

  -- Developer page
  SELECT payload FROM gc_developer_profiles WHERE slug = $1;

  -- ⚠️  RULE: NEVER return "bedrooms: 0" — always query units[] as above
  -- ⚠️  RULE: NEVER say "no results found" without running the SQL first
  -- ⚠️  RULE: area filter MUST use ILIKE not exact match

━━━ UNIT BEDROOM DISPLAY — ABSOLUTE (ZERO EXCEPTIONS) ━━━━━━━━
  bedrooms=0  → ALWAYS "Studio"      NEVER "0-bedroom" / "0BR" / "0 bed"
  bedrooms=1  → "1-Bedroom" or "1BR"
  bedrooms=2  → "2-Bedroom" or "2BR"
  bedrooms=3  → "3-Bedroom" or "3BR"
  bedrooms=4  → "4-Bedroom" or "Penthouse"

  Correct:   "A Studio apartment in Bellevue Towers (Downtown Dubai)"
  WRONG:     "A 0-bedroom apartment in Bellevue Towers Studio"
  WRONG:     "0BR", "0-bed", "0 bedrooms", "zero bedroom"

  When listing search results, ALWAYS format as:
    "{unit.type} in {project.name} ({project.area}) from AED {unit.priceFrom}"
  where unit.type comes from payload.units[].type (already set to "Studio"
  for bedrooms=0 — trust the type field, never render the number 0)

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

━━━ 6 INVESTMENT INTELLIGENCE BLOCKS (payload keys) ━━━━━━━━━━

Every project has 6 sub-objects in payload. Here is exactly how
to render each one on the single project page.

1. investmentFlags  →  BADGE ROW  (below hero, above price)
   Show pill badge only when true / demandHotness >= 70:
   readyNow          "Ready to Move In"   bg-emerald-600
   safeYield         "Safe Yield"         bg-blue-600
   flipOpportunity   "Flip Opportunity"   bg-amber-500
   marketDiscount    "Below Market"       bg-purple-600
   highRiskReturn    "High Risk·Return"   bg-red-500
   demandHotness≥70  "High Demand 🔥"    bg-orange-500
   goldenVisaEligible already in top-level columns → gold badge
   lifecycleState    subtle text pill below the badge row

2. rentalIntelligence  →  STATS STRIP  (below price block)
   4 columns: estimatedMonthlyRent | occupancyRate | grossYield | marketBalance
   marketBalance chip: UNDERSUPPLIED=green / BALANCED=grey / OVERSUPPLIED=red
   rentalDemandScore → thin progress bar 0-100 "Rental Demand"
   confidence → tiny "HIGH"/"MEDIUM" badge on strip corner

3. priceIntelligence  →  PRICE CONTEXT  (beside main price)
   pricePerSqft "AED 1,400 / sqft"
   pricePerSqm  "AED 15,069 / sqm"
   vsCohortPct  positive=above market (amber), negative=below market (green)
   cohortMedian "Area median AED 1.2M" as reference label

4. roiCalculator  →  INVESTMENT RETURNS CARD  [Investment tab]
   HERO:  breakEvenYears — large central number + label "Years to Break Even"
   2×2 grid below:
     roicPct          "13.9%  ROIC"
     capitalGainPct   "14.7%  Capital Gain"
     annualTotalIncome "AED 73,654  Annual Income"
     totalCashReturn  "AED 225,640  Total Return"
   Stacked bar: annualRentalIncome vs annualAppreciation = "Income vs Growth"

5. secondaryMarket  →  RESALE PANEL  [Resale tab]
   appreciationRate  "2.98% / yr Capital Appreciation"
   liquidityScore    circular gauge 0-100 (green≥70, amber40-69, red<40)
   avgHoldDays       "Avg Hold 462 days before resale"
   demand            chip HIGH/NORMAL/LOW
   flipRatio         "20% of sales are flips"

6. aiNarrative  →  AI INSIGHT CARD  [Overview tab]
   Highlighted pull-quote card with ✦ spark icon.
   investorProfile → headline (bold)
   problemSolved   → "Best for: …"
   holdingLogic    → italic insight below
   identity        → top-right badge
   Skip entirely if investorProfile is blank or "Unknown".

━━━ PROJECT PAGE TAB LAYOUT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /projects/[slug]:
  ┌──────────────────────────────────────────────────────────┐
  │  Hero image + gallery lightbox                           │
  │  investmentFlags badge row                               │
  │  Project name · Developer · Area · Status               │
  │  Price from AED X  |  rentalIntelligence stats strip     │
  │  priceIntelligence (PSF + vs cohort)                     │
  │  [Overview] [Investment] [Rental] [Resale]               │
  ├──────────────────────────────────────────────────────────┤
  │ Overview:   description · amenities grid · units grid    │
  │             aiNarrative card · area map                  │
  │             virtualTour embed + floor plans              │
  ├──────────────────────────────────────────────────────────┤
  │ Investment: roiCalculator card (breakEvenYears hero)     │
  │             deliveryIntelligence (confidence·pressure)   │
  │             paymentPlan + timeline                       │
  ├──────────────────────────────────────────────────────────┤
  │ Rental:     rentalIntelligence full stats                │
  │             Demand score bar · marketBalance chip        │
  │             Monthly / annual rent estimates              │
  ├──────────────────────────────────────────────────────────┤
  │ Resale:     secondaryMarket full panel                   │
  │             Liquidity gauge + appreciation callout       │
  └──────────────────────────────────────────────────────────┘

━━━ AI CHAT RULES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Inject llm_context rows into Gemini system prompt
  - All yield/ROI outputs: "projected" / "estimated" — never exact
  - Footer attribution: "Data: Entrestate Intelligence"
  - Golden Visa filter: WHERE golden_visa_eligible = true
  - "Monthly rent?" → rentalIntelligence.estimatedMonthlyRent
  - "Break even?"   → roiCalculator.breakEvenYears
  - "Below market?" → priceIntelligence.vsCohortPct
  - "Flip or hold?" → aiNarrative.holdingLogic
  - "How liquid?"   → secondaryMarket.liquidityScore
  - Studio display: bedrooms=0 in DB → ALWAYS say "Studio" in response
    FORBIDDEN: "0-bedroom", "0BR", "0 bed", "zero bedroom" — NEVER use these



