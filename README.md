# jp-mining-note

## Foreword

This project is a fork of the outstanding JP Mining Note project created by
Aquafina-Water-Bottle. Aquafina went silent a couple of months ago, and in
the meantime, bugs have started to creep into this project as other supporting
software has received updates.

The purpose of this fork is to provide bugfixes for JPMN until Aquafina returns
to take over maintenance again. I don't have the time or expertise to continue
adding features to the note, but hopefully I can keep it functional.

Version 0.11.0.5 has been released alongside this fork. It resolves a bug that
prevented pitch accent information from being displayed correctly after a recent
AJT Japanese update. Instructions for updating can be found in the [documentation](https://arbyste.github.io/jp-mining-note/).

When Aquafina returns and resumes maintenance of the main project, I will close
down this fork. The documentation for the original project can be found [here](https://aquafina-water-bottle.github.io/jp-mining-note/).

---

**jp-mining-note** (JPMN) is an Anki card template for studying Japanese,
designed to be visually appealing and simple to use without sacrificing functionality.
Easily paired with most automatic card creation workflows,
this aims to make your experience with Anki as smooth as possible.

<!-- clickable image -->
[![Example Image](https://github.com/Aquafina-water-bottle/jp-mining-note/raw/master/docs/docs/assets/nisemono_readme.png)](https://github.com/Aquafina-water-bottle/jp-mining-note/raw/master/docs/docs/assets/nisemono_readme.png)


Note that this project is still in its early stages.
Better support across systems and more features are planned for the future.


# Demos

<!--
- hover over furigana
- click on image
- kanji hover
- collapsable fields
- front/back
-->
<details>
<summary><i>GUI (click here)</i></summary>
<video src="https://user-images.githubusercontent.com/17107540/187550103-7e50c317-9074-4c7c-a499-fa4ddc89e419.mp4"></video>
</details>


<!--
- front -> back
- IsSentenceCard
- IsTargetedSentenceCard
- IsHoverCard
- AltDisplay
    - newline (-> backside)
    - only last sentence (-> frontside)
- Hint + click
- HintNotHidden
- (TODO) editing pitch accent
- PAShowInfo
    - PATestOnlyWord
    - PADoNotTest
-->
<details>
<summary><i>Fields (click here)</i></summary>
<video src="https://user-images.githubusercontent.com/17107540/192704142-d8587e82-3c90-4754-a23d-7b7ffff9a164.mp4"></video>
</details>



<!--
- temporarily un-hide bilingual definitions
- temporarily disable the 2nd bilingual dictionary

texthooker text:
Card creation:
1. Yomichan + mpvacious
2. Yomichan only (no pictures and sentence audio)
3. Bilingual Format
4. Selected dictionary
5. Selected text
6. Sentence Card
-->
<details>
<summary><i>Card Creation (click here)</i></summary>
<video src="https://user-images.githubusercontent.com/17107540/192704164-dd075092-58da-4964-9ddf-d89627f60d3c.mp4"></video>
</details>


# Known Limitations
* No support for mobile. (Support for Ankidroid is planned for the future, but with no ETA.)

# Get Started
See the documentation [here](https://arbyste.github.io/jp-mining-note/).

# Other Info
Tested on Anki 2.1.54 (Qt6), Linux (Ubuntu) & Windows.

It is recommended you use the latest version of Anki if possible.

# License
MIT. Go insane.


