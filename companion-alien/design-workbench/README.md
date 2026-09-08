# Joe's Journey companion alien asset pack

All PNG files use the same 1024 × 1024 transparent canvas. Place layers without resizing or repositioning them.

## Layer order

From back to front:

1. `back-*`
2. `body.png` or one `body-*` colour
3. `eyes-*-open.png` or `eyes-*-closed.png`
4. `mouth-*`
5. `eyewear-*`
6. One `hair-*`, `hat-*`, or `headfull-*` item
7. `hand-*` and `offhand-*`

Handed-item rule: the shield sits on the viewer's left and is drawn in front of the body and left hand. Swords, staffs, wands, paintbrushes and pencils sit on the viewer's right, in front of the right hand, followed by the small `hand-thumb-overlay-*` layer over the grip. This keeps every held item readable while making it look properly held.

The approved companion base is the wider body with no body outline. Only the hands, feet and antenna tips use a separating outline. Whole-head items must be fitted to this body; the antennae render above helmets without adding custom holes.
8. `orbit-*`

`headfull-*` items replace hats and hair. Open and closed eye files share exact registration, so blinking only requires swapping the image source. The four `body-*` alternatives also share exact registration with `body.png`.

Hair is supplied as messy, mohawk, shaved-sides and long styles. Every style has brown, blue, silver-grey, blonde and black variants. The bow and blush are independent accessories, so they can be combined with any compatible hair or outfit.

The scar expression uses a narrowed villain eye with the cut passing through the eye itself. The scar, open eye and closed eye must keep identical registration so blinking does not move it.

The Princess set consists of `hat-princess-crown.png`, `body-princess-dress.png`, `hand-princess-wand.png`, `accessory-hair-bow.png` and `makeup-blush.png`. The held-item thumb overlay follows the same rule as the Knight sword and Wizard staff.

`orbit-mars.png` and `orbit-jupiter.png` use the existing horizontal-scroll planet art and are intended to unlock when those planets are clicked.

The `preview-*` files are flattened reference images for checking the Knight, Space, Wizard, Princess, hair, face, paintbrush and plush designs. They are not required by the in-site layer stack and must never be shipped in place of the separate transparent layers.
