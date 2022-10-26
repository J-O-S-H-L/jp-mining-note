{% include "jp-mining-note/partials/anki_persistence.js" %}

{% from "modules/main.html" import modules with context %}

{% for m in modules.values() %}
{% if m.js is defined and m.js.globals.get(note.card_type, note.side, modules.keys()) %}
// GLOBALS: {{ m.id }}
{{ m.js.globals.get(note.card_type, note.side, modules.keys()) }}
{% endif %}
{% endfor %}



(function () { // restricts ALL javascript to hidden scope

// "global" variables within the hidden scope
let note = (function () {
  let my = {};
  return my;
}());



/*
 * Toggles the display of any given details tag
 */
function toggleDetailsTag(ele) {
  if (ele.hasAttribute('open')) {
    ele.removeAttribute('open');
  } else {
    ele.setAttribute("open", "true");
  }
}

function popupMenuMessage(message, isHTML=false) {
  let popupMenu = document.getElementById("popup_menu");

  // creates message
  const popupMessageDiv = document.createElement("div");
  if (isHTML) {
    popupMessageDiv.innerHTML = message;
  } else {
    popupMessageDiv.innerText = message;
  }
  popupMessageDiv.classList.add("popup-menu--animate");

  popupMenu.appendChild(popupMessageDiv);

  // kills the popup after the animations play
  setTimeout(() => {
    popupMenu.removeChild(popupMessageDiv);
    LOGGER.debug(`Removed popup: "${message}"`, 2);
  }, 1000*(0.6+3+0.75))
}



// START_BLOCK: js_functions
{% block js_functions %}
{% endblock %}
// END_BLOCK: js_functions

{% for mid, m in modules.items() %}
{% if m.js is defined %}

{{ m.js.functions.get(note.card_type, note.side, modules.keys()) }}

{% endif %}
{% endfor %}


{% if COMPILE_OPTIONS("keybinds-enabled").item() %}
// a general function to implement all keybinds necessary by the card.
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  let keys = null;
  let ele = null;

  // START_BLOCK: js_keybind_settings
{% filter indent(width=2) %}
{% block js_keybind_settings %}
{% endblock %}
{% endfilter %}
  // END_BLOCK: js_keybind_settings

{% for m in modules.values() %}
{% if m.js is defined and m.js.keybinds.get(note.card_type, note.side, modules.keys()) %}
{% filter indent(width=2) %}
  // KEYBINDS: {{ m.id }}
  {{ m.js.keybinds.get(note.card_type, note.side, modules.keys()) }}

{% endfilter %}
{% endif %}
{% endfor %}


  if (e.getModifierState && e.getModifierState('CapsLock')) {
    if (e.key === "CapsLock") {
      // either just enabled or disabled, not sure which one is which
      // it seems like normal browsers can't reach this point during (caps lock enabled -> caps lock disabled...)
      LOGGER.removeWarn("caps");
    } else if (!["Meta"].includes(e.key)) {
      LOGGER.debug(e.key);
      LOGGER.warn("Caps lock is enabled. Keybinds may not work as expected.", true, "caps")
    }
  } else {
    LOGGER.removeWarn("caps");
  }


  /// {% call IF("WordAudio") %}
  keys = {{ utils.opt("keybinds", "play-word-audio") }};

  if (keys !== null && keys.includes(e.key)) {
    ele = document.querySelector("#word-audio .soundLink, #word-audio .replaybutton");
    if (ele) {
      ele.click();
    }
  }
  /// {% endcall %}

  /// {% call IF("SentenceAudio") %}
  keys = {{ utils.opt("keybinds", "play-sentence-audio") }};
  if (keys !== null && keys.includes(e.key)) {

    let hSent = document.getElementById("hybrid-sentence");

    /// {% if note.card_type == "main" and note.side == "front" %}
    if ({{ utils.opt("hybrid-sentence-open-on-play-sentence") }}
        && '{{ utils.any_of_str("IsHoverCard", "IsClickCard") }}'
        && '{{ utils.any_of_str("IsTargetedSentenceCard", "IsSentenceCard") }}'
        && hSent !== null && !hSent.classList.contains("override-display-inline-block")) {
      hybridClick();
    } else {
    /// {% endif %}
      ele = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
      if (ele) {
        ele.click();
      }
    /// {% if note.card_type == "main" and note.side == "front" %}
    }
    /// {% endif %}
  }
  /// {% endcall %}

  keys = {{ utils.opt("keybinds", "toggle-front-full-sentence-display") }};
  ele = document.getElementById("full_sentence_front_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }

  /// {% call IF("Hint") %}
  keys = {{ utils.opt("keybinds", "toggle-hint-display") }};
  ele = document.getElementById("hint_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% if note.side == "back" %}
  /// {% call IF("SecondaryDefinition") %}
  keys = {{ utils.opt("keybinds", "toggle-secondary-definitions-display") }};
  ele = document.getElementById("secondary_definition_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% call IF("AdditionalNotes") %}
  keys = {{ utils.opt("keybinds", "toggle-additional-notes-display") }};
  ele = document.getElementById("additional_notes_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% call IF("ExtraDefinitions") %}
  keys = {{ utils.opt("keybinds", "toggle-extra-definitions-display") }};
  ele = document.getElementById("extra_definitions_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  if ('{{ utils.any_of_str("PAGraphs", "UtilityDictionaries") }}') {
    keys = {{ utils.opt("keybinds", "toggle-extra-info-display") }};
    ele = document.getElementById("extra_info_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  }
  /// {% endif %} {# note.side == back #}

})
/// {% endif %} {# keybinds-enabled #}


function main() {

  // sanity check: options
  /// {% if not COMPILE_OPTIONS("hardcoded-runtime-options").item() %}
  if (typeof JPMNOpts === 'undefined') {
    LOGGER.warn('JPMNOpts was not defined in the options file. Was there an error? ' +
      'Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#warning-jpmnopts-was-not-defined-in-the-options-file-was-there-an-error">here</a> for basic troubleshooting.', isHtml=true);
  }
  /// {% endif %} {# COMPILE_OPTIONS("hardcoded-runtime-options").item() #}

  // sanity check: checks that both `IsHoverCard` and `IsClickCard` are both not activated
  /// {% call IF("IsHoverCard") %}
  /// {% call IF("IsClickCard") %}
  LOGGER.warn("Both `IsHoverCard` and `IsClickCard` are filled. At most one should be filled at once.");
  /// {% endcall %}
  /// {% endcall %}


  // clicks on the info circle to freeze the popup (good for debugging and all)
  if ({{ utils.opt("info-circle-togglable-lock") }}) {

    const showPopup = {{ utils.opt("info-circle-togglable-lock-show-popup") }};

    function addLockFunc(clickEle, circEle, displayName, frozenClassName, togglableClassName, showPopup) {
      if (clickEle === null || circEle === null) {
        return;
      }

      clickEle.classList.add(togglableClassName);
      clickEle.onclick = function() {
        if (circEle.classList.contains(frozenClassName)) {
          circEle.classList.remove(frozenClassName);
          if (showPopup) {
            popupMenuMessage(`${displayName} unlocked.`, true);
          }
        } else {
          circEle.classList.add(frozenClassName);
          if (showPopup) {
            popupMenuMessage(`${displayName} locked.`, true);
          }
        }
      }

    }

    // main info circle
    let infoCirc = document.getElementById("info_circle");
    let infoCircWrapper = document.getElementById("info_circle_wrapper");
    const infoCircFrozen = "info-circle--frozen";
    const infoCircTogglable = "info-circle-svg-wrapper--togglable";
    addLockFunc(infoCircWrapper, infoCirc, "Info circle tooltip", infoCircFrozen, infoCircTogglable, showPopup);

    // TODO maybe fix later, so clicking on the pop-up won't also toggle it
    //let sameReadingIndicator = document.getElementById("same_reading_indicator");
    //let sameReadingCirc = document.getElementById("same_reading_hover_circle");
    //const sameReadingCircFrozen = "hover-text--frozen";
    //const sameReadingCircTogglable = "dh-left__same-reading-indicator--togglable";
    //addLockFunc(sameReadingIndicator, sameReadingCirc, "Same-Reading indicator<br>",
    //    sameReadingCircFrozen, sameReadingCircTogglable);

  }

  if (!{{ utils.opt("info-circle-hoverable") }}) {
    let infoCircWrapper = document.getElementById("info_circle_wrapper");
    infoCircWrapper.classList.remove("info-circle-svg-wrapper--hoverable");
  }


  // START_BLOCK: js_run
{% filter indent(width=2) %}
{% block js_run %}
{% endblock %}
{% endfilter %}
  // END_BLOCK: js_run

{% for m in modules.values() %}
{% if m.js is defined and m.js.run.get(note.card_type, note.side, modules.keys()) %}
  try { // RUN: {{ m.id }}
    {% filter indent(width=4) %}
    {{ m.js.run.get(note.card_type, note.side, modules.keys()) }}
    {% endfilter %}
  } catch (error) {
    LOGGER.error("Error in module {{ m.id }}:");
    LOGGER.errorStack(error.stack);
  }

{% endif %}
{% endfor %}

}



main();



}());
