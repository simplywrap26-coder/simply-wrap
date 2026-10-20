# Banners, ads, announcements, reviews, social posts (no code needed)

All of these are Shopify **metaobjects**. For each one: Settings > Custom data > Metaobjects > Add definition,
create the fields below, and **turn on Storefront API access**. Then add entries under Content > Metaobjects.
Unpublished or inactive entries do not show. If none exist, the site shows its defaults or hides the section.

## `banner` (hero slider and ad banners)
| Field key | Type | Notes |
|---|---|---|
| heading | Single line text | Optional headline |
| subheading | Single line text | Optional |
| button_label | Single line text | Optional; with `link` it shows a button |
| link | Single line text | `/collections/matte`, `/products/handle`, or a full https URL |
| image | File (image) | Required |
| placement | Single line text | `hero` (top slider) or `promo` (ad cards lower on home) |
| sort_order | Integer | Lower shows first |
| active | True or false | Untick to hide without deleting |

Image sizes: hero about 2400x1050 (keep text-safe content in the centre; it crops on phones); promo about 1600x800.
One hero banner shows as a still image; two or more become an auto-sliding carousel. With no hero banners, the built-in hero shows.
Scheduling by date is not built: switch `active` on and off yourself.

## `announcement` (scrolling top bar)
Fields: `text` (single line), `active` (true or false).

## `review`
Fields: `name`, `location`, `text` (single line or multi-line text), `rating` (integer 1 to 5), `active`.
Only add real reviews you have permission to show.

## `social_post`
Fields: `image` (file), `link` (single line, the post URL), `active`. Up to 6 show. Set `VITE_INSTAGRAM_URL` for the profile link.

## Other home sections
- Shop by style and finish: your Shopify collections with images (e.g. Matte, Textured, Embossed).
- Featured wraps: set `VITE_FEATURED_COLLECTION` to a collection handle.
- Collections menu in the header lists your collections automatically.
