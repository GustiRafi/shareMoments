/goal

Redesign the entire UI/UX of the existing app without changing its core functionality.

The current implementation works, but the visual design feels generic, empty, and too much like a basic event template. Rework the UI from scratch while keeping the existing React/Vite/Supabase functionality intact.

## Design Direction

Create a polished, playful Neo-Brutalist design for a digital disposable camera made specifically for an Indonesian community event.

The feeling should be:

- Fun
- Energetic
- Youthful
- Local/community-driven
- Slightly retro
- Bold
- Playful
- Memorable

Think "digital disposable camera for an Indonesian 17 August event", NOT "generic Independence Day website".

Keep Neo-Brutalism as the main visual language:
- Thick black borders
- Offset hard shadows
- Bold typography
- Strong geometric shapes
- High contrast
- Slightly asymmetric compositions
- Chunky interactive elements
- Clear visual hierarchy
- Tactile buttons that visually move when pressed

Avoid making it look messy or childish. The design should feel intentionally designed and modern.

## Color Direction

Use Indonesian Independence Day colors, but DO NOT make everything red.

Primary palette:
- Off-white / warm white background
- Black for typography, borders, and shadows
- Strong Indonesian red as the main accent
- Very subtle secondary neutral tones

Red should be used strategically for:
- Primary CTA
- Important highlights
- Decorative elements
- Interactive states

Avoid:
- Excessive red
- Red borders everywhere
- Generic red rectangles
- Diagonal stripe backgrounds
- Canva-style Independence Day decorations

The Indonesian identity should feel integrated into the design rather than pasted on top.

## IMPORTANT: NO EMOJIS

Do not use Unicode emojis anywhere in the UI.

Do NOT use:
- 📸
- 🇮🇩
- ⭐
- 🎉
- ❤️
- etc.

Use an icon library instead, preferably Lucide React.

Icons should feel consistent with the Neo-Brutalist visual style.

## Copywriting

Rewrite the UI copy to be fun, short, and conversational.

Avoid generic copy such as:
- "Abadikan momennya"
- "Belum ada foto"
- "Ambil foto pertama"
- "Photo Gallery"

Use playful Indonesian copy that feels natural for a community event.

Examples of the tone:

Landing:
"Jepret dulu, mikir belakangan."
"Foto random juga gapapa."
"Satu jepretan, jadi kenangan."

CTA:
"JEPRET SEKARANG"
"AYO JEPRET"
"AMBIL FOTO"

Gallery:
"Jepretan Warga"
"Jejak Foto Hari Ini"
"Yang Udah Dijepret"

Empty gallery:
"Belum ada yang jepret."
"Jadilah orang pertama."

Success:
"Jepret! Foto udah masuk."
"Berhasil! Jepretanmu aman."

Choose copy that fits the design naturally. Keep text concise.

## Indonesian Independence Visual Elements

Add subtle visual elements inspired by 17 August / Indonesian Independence Day.

Do NOT use generic flag images everywhere.

Instead use small custom visual details such as:
- Red and white geometric shapes
- Abstract flag-inspired blocks
- Small waving red/white elements
- Number "81"
- Simple celebration lines
- Red/white dots
- Small stars or spark shapes as ICONS, not emojis
- Subtle motion inspired by waving flags
- Decorative red/white shapes around important UI elements

These elements should feel like part of the design system.

Add a few subtle animations:
- Small red/white decorative elements gently moving
- Button press animation
- Hover/tap movement
- Shutter animation when taking a photo
- Confetti/success animation after upload
- Subtle entrance animations for gallery items
- Small micro-interactions when navigating between pages

Animations should be fast and playful.

Do NOT over-animate the interface.

## Landing Page `/`

Completely redesign the landing page.

The user arrives here from a QR code printed on the event coupon.

The primary goal is obvious:

TAKE A PHOTO.

The page should immediately communicate that this is a shared event camera.

Suggested hierarchy:

Small event badge / decorative element

JALAN SEHAT
17 AGUSTUS 2026

Short playful headline

Large primary CTA:
"JEPRET SEKARANG"

Secondary link:
"Lihat jepretan"

Small footer:
"Built by Gusti"
"gustirafi.my.id"

The CTA should be the strongest visual element.

Make the layout feel intentionally composed rather than vertically centered with large empty spaces.

Use asymmetric Neo-Brutalist cards/shapes and decorative elements to create personality.

## Camera Page `/camera`

Redesign the camera UI so it feels like a real digital disposable camera.

The camera viewport should dominate the screen.

Use:
- Black camera background
- Strong framed viewport
- Thick borders
- Large tactile shutter button
- Front/rear camera switch button
- Back button
- Gallery button

Controls should look custom-designed, not like default browser buttons.

The shutter button should be visually distinctive.

When pressed:
- Button physically moves
- Short shutter animation
- Upload progress feedback
- Success animation
- Confetti
- Short success message

Keep the camera experience extremely simple.

NO:
- Photo preview
- Editing
- Filters
- Captions
- Overlays
- Frames

The experience remains:

POINT → SHOOT → UPLOAD → DONE

## Gallery Page `/gallery`

Redesign the gallery to feel like a community photo wall.

Use:
- Responsive masonry/grid
- Slightly irregular card sizing
- Thick borders
- Hard shadows
- Subtle rotations where appropriate
- Fun but controlled composition

Do not make every photo card identical.

Clicking a photo opens a large lightbox.

Lightbox:
- Fullscreen
- Previous/next
- Close
- Mobile-friendly
- Swipe support if practical

Add subtle entrance animations when photos appear.

Empty state should still look designed and intentional.

Example:

"Belum ada yang jepret."

"Yuk jadi yang pertama."

[ JEPRET SEKARANG ]

## Mobile First

Mobile is the primary platform.

Design for approximately 360–430px wide screens first.

Prioritize:
- Large touch targets
- One-handed interaction
- Clear CTA
- Proper safe areas
- No horizontal scrolling
- Camera viewport using available screen space
- Fast visual feedback

Desktop should be a responsive adaptation, not the primary design.

## Branding

Keep:

"Built by Gusti"
"gustirafi.my.id"

Make it subtle but intentional.

Do not make the branding dominate the page.

## Important Constraints

Do NOT change:
- Supabase functionality
- Camera functionality
- Upload logic
- Image compression
- Routing
- Gallery functionality

Only improve the UI/UX, copywriting, animations, and visual presentation.

Do not add unnecessary features.

The final result should feel like a real small product, not a generated template.

Most importantly:

MAKE IT FUN.

The user should open the QR link and immediately think:

"anjir lucu, pengen jepret."

Not:

"oh, website acara."

Redesign the existing UI accordingly.