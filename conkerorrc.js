/*
  + ~/.conkerorrc/conkerorrc.js

  + To check which version of XULRunner conkeror is "seeing", check
  /usr/share/.../contrib/list-xulrunner-versions. 

  + `conkeror -q' starts the conkeror without reading this file.
  

** Hint classes

| key | hint class |
|-----+------------|
| n   | links      |
| i   | images     |
| m   | frameset   |
| **  | dom nodes  |
|-----+------------|

** Content buffers

| command    | binding                   |
|------------+---------------------------|
| M-x reinit | reloads the rc file       |
|------------+---------------------------|
| f1 b       | list keys current context |
|------------+---------------------------|
| s          | save link                 |
| i s        | save image                |
| e s        | save media                |
|------------+---------------------------|
| c          | copy url                  |
| c 0        | copy current url          |
| # c        | copy url for anchor       |
| i c        | copy image                |
|------------+---------------------------|
| G          | reload url                |
|------------+---------------------------|
| x          | shell command on file     |
| X          | shell-command on url      |
| M-!        | shell-command             |
|------------+---------------------------|

** Copying text
: n ;
Focus link (when you focus a link, the invisible cursor will be at the
left at the first character of the link text). 

: ** c
Copy DOM modes. 

: ** T c
Copy text from any dom node.

: isearch
The cursor will be at where the search concluded.

:  M-x caret-mode
Get a small visible blinking cursor.

** Download buffer

| command | binding                             |
|---------+-------------------------------------|
| d       | cancel download                     |
| p       | pause                               |
| r       | retry                               |
| C-d     | remove                              |
| o       | run shell command on dowloaded file |
|---------+-------------------------------------|

+ Type `M-x dowload-manager-show-builtin-ui' for a list of downloaded
  files.
*/


// ========
// Homepage
// ========
dumpln("homepage");
homepage = "/home/makmiller/.conkerorrc/conkerorrc.js";

// =======
// Modules
// =======
require("mode-line.js");

// ==========
// Extensions
// ==========
session_pref("xpinstall.whitelist.required", false);
user_pref("extensions.checkCompatibility", false);

// disable the security system so that I can install xpi files from
// any site


// ===========
// Keybindings
// ===========
dumpln("key bindings");
require("global-overlay-keymap");

//C-m and C-i
define_key_alias("C-m", "return");
define_key_alias("C-i", "tab");

// escape as a stick key
define_sticky_modifier("escape", "M");

// C-h as backspace 
define_key(content_buffer_text_keymap, "C-h","cmd_deleteCharBackward"); 
define_key(minibuffer_keymap, "C-h", "cmd_deleteCharBackward");
define_key(hint_keymap, "C-h","hints-backspace");

// M-h as delete word backward
define_key(content_buffer_text_keymap, "M-h","cmd_deleteWordBackward");
define_key(minibuffer_keymap, "M-h", "cmd_deleteWordBackward");

// dvorak stuff 
define_key(content_buffer_normal_keymap, "C-t","cmd_scrollLineUp"); 
define_key(content_buffer_text_keymap, "C-t","backward-line"); 
define_key(minibuffer_keymap, "C-t","minibuffer-complete-previous");
define_key(minibuffer_keymap, "M-t","minibuffer-history-previous");
define_key(hint_keymap, "C-t","hints-previous");
define_key(content_buffer_normal_keymap, "C-.","execute-extended-command");


// This binds the key 'w' in content buffers to the 'copy' command,
// and will cause it to prompt for any DOM node, instead of just
// links:
define_key(content_buffer_normal_keymap, "w", "copy",
           $browser_object = browser_object_dom_node);

// -------
// Hinting
// -------

// using letters instead of numbers
hint_digits="iueoadhtnsyp.,'fgcrl";

// follow when hitting is unique
hints_auto_exit_delay = 25;

//big hint numbers
register_user_stylesheet(
    "data:text/css," +
        escape(
            "@namespace url(\"http://www.w3.org/1999/xhtml\");\n" +
		"span.__conkeror_hint {\n"+
		"  font-size: 14px !important;\n"+
		"  line-height: 14px !important;\n"+
		"}"));
// Note: depending on the size of the hints, they may superimpose each
// other.

// ==========
// Completion
// ==========
url_completion_use_history = false; // that was taking too long
url_completion_use_bookmarks = true;
minibuffer_auto_complete_default = true;

// =====
// Modes
// =====

// -------------
// Google search
// -------------
// Note: the idea of this mode is to make the follow command to
// operate on the search results links
dumpln('google search');
require('page-modes/google-search-results.js');
// Note: removing this line causes conkeror not to recognize the
// function google_search_bind_number_shortcuts

google_search_bind_number_shortcuts(); 
// next/previous without mouse
define_key(content_buffer_normal_keymap, "N", "follow", $browser_object = browser_object_relationship_next);
define_key(content_buffer_normal_keymap, "P", "follow", $browser_object = browser_object_relationship_previous);

// ----------
// Gmail mode
// ----------
require('page-modes/gmail.js'); 

define_key(gmail_keymap, "G", null, $fallthrough); 
define_key(gmail_keymap, "g", "find-url");

define_key(gmail_keymap, "F", null, $fallthrough);
define_key(gmail_keymap, "f", "follow");

define_key(gmail_keymap, "R", null, $fallthrough);


// ----------------
// Additional modes
// ----------------
require("page-modes/youtube.js");
// require("page-modes/youtube-player.js"); 
// youtube-player should be enabled by default
require("page-modes/google-video.js");

// =======
// Buffers
// =======
// -------------------------------
// Using numbers to switch buffers
// -------------------------------
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
}
for (let i = 0; i < 10; ++i) {
    define_switch_buffer_key(String((i+1)%10), i);
}

// ----------------------------------------
// Open links in new buffers with the mouse
// ----------------------------------------
require("clicks-in-new-buffer.js"); 
// Set to 0 = left mouse, 1 = middle mouse, 2 = right mouse 
clicks_in_new_buffer_button = 2; // Now right mouse follows links in new buffers. 
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;


// =========
// Downloads
// =========

// remember last saved directory for downloads
{
   let _save_path = get_home_directory();

   function update_save_path(info) {
       _save_path = info.target_file.parent.path;
   }

   add_hook("download_added_hook", update_save_path);

   suggest_save_path_from_file_name = function (filename, buffer) {
       let file = make_file(_save_path);
       file.append(filename);
       return file.path;
   }
}

//load download buffers in the background in the current window
download_buffer_automatic_open_target = OPEN_NEW_BUFFER_BACKGROUND;

// ====
// Tabs
// ====
require('new-tabs.js');
// sheet.appendRelativePath(".conkerorrc/stylesheets/for-tabs.css"); 

// Tab navigation

define_key(default_global_keymap, "C-c C-n","buffer-next");
define_key(default_global_keymap, "C-c C-t","buffer-previous");
define_key(minibuffer_keymap, "C-c C-n","buffer-next");
define_key(minibuffer_keymap, "C-c C-t","buffer-previous");

// =========
// Mode line
// =========
load_paths.unshift("chrome://conkeror-contrib/content/");
require("mode-line-buttons.js");
mode_line_add_buttons(standard_mode_line_buttons, true);

// ========
// Webjumps
// ========

// --------------
// shortcut gmail
// --------------

interactive("open-gmail", "Go to gmail", "follow",
            $browser_object = "http://gmail.com/");
define_key(content_buffer_normal_keymap, "M-g", "open-gmail");

// Note: because this command is defined as an alias to the follow
// command, you use C-u to open gmail in new buffer

// ------------------
// Selection searches
// ------------------
// selection searches
// selection searches
function create_selection_search(webjump, key) {
    interactive(webjump+"-selection-search",
                "Search " + webjump + " with selection contents",
                "find-url-new-buffer",
                $browser_object = function (I) {
                    return webjump + " " + I.buffer.top_frame.getSelection();});
    define_key(content_buffer_normal_keymap, key.toUpperCase(), webjump + "-selection-search");

    interactive("prompted-"+webjump+"-search", null,
                function (I) {
                    var term = yield I.minibuffer.read_url($prompt = "Search "+webjump+":",
                                                           $initial_value = webjump+" ");
                    browser_object_follow(I.buffer, FOLLOW_DEFAULT, term);
                });
    define_key(content_buffer_normal_keymap, key, "prompted-" + webjump + "-search");
}
// examples
// create_selection_search("google","h");
// create_selection_search("wikipedia","w");
// create_selection_search("dictionary","d");
// create_selection_search("myspace","y");
// create_selection_search("amazon","a");
// create_selection_search("youtube","u");

minibuffer_read_url_select_initial = false;
// this is for the selection searches (suggested by the conkeror wiki). 


// define_key(content_buffer_normal_keymap, ".", "teste");

// create_selection_search("g","l");
// create_selection_search("google","h");
// create_selection_search("free-dic","o");
// create_selection_search("wikipedia","a");

// Description: pressing w will prompt you what to search on Wikipedia
// (with autocomplete), or pressing W will automatically search what
// you have currently selected.

// -----------------------
// open multiple bookmarks
// -----------------------

// interactive("open-all","opens bookmarks I visit frequently",
//             function(I){
//                 load_url_in_current_buffer("https://login.ezproxy.lib.ucalgary.ca/login?qurl=http%3a%2f%2fwww.ncbi.nlm.nih.gov%2fsites%2fentrez%3fotool%3dicaucallib",I.window);
//                 load_url_in_new_buffer("https://login.ezproxy.lib.ucalgary.ca/login?url=http://apps.webofknowledge.com/WOS_GeneralSearch_input.do?product=WOS&search_mode=GeneralSearch&SID=2DojgeDM7NBB4fhP9jH&preferencesSaved=",I.window);
// 		load_url_in_new_buffer("https://login.ezproxy.lib.ucalgary.ca/login?url=http://scholar.google.ca/",I.window);
//             });
// define_key(content_buffer_normal_keymap, "f3", "open-all");

// ----
// News
// ----
define_webjump("news", "http://news.google.com/news/search?q=%s");
define_webjump("news-bbc", "http://www.bbc.co.uk/search/news/?q=%s", $alternative="http://www.bbc.co.uk/news");
define_webjump("news-guardian", "http://www.guardian.co.uk/search?q=%s", $alternative="http://www.guardian.co.uk");

// ------------
// Dictionaries
// ------------
define_webjump("free-dic","http://www.thefreedictionary.com/%s");
// define_webjump("sp-dic", "http://www.spanishdict.com/translate/%s");
define_webjump("thesaurus","http://www.thefreedictionary.com/%s#Thesaurus");
define_webjump("trans", "http://translate.google.com/translate_t#auto|en|%s");

// ------
// Movies
// ------
define_webjump("imdb", "http://imdb.com/find?q=%s");
define_webjump("rottentomatoes", "http://www.rottentomatoes.com/search/full_search.php?search=%s");

// ------
// Videos
// ------
define_webjump("youtube", "http://www.youtube.com/results?search_query=%s&search=Search");

// --------
// Shopping
// --------
define_webjump("amazon", "http://www.amazon.com/exec/obidos/external-search/?field-keywords=%s&mode=blended");

// ------
// Images
// ------
define_webjump("imagesgoogle", "http://www.google.com/images?q=%s", $alternative = "http://www.google.com/imghp");

// -----
// Emacs
// -----
//emacswiki 
define_webjump("emacswiki", "http://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi"+ "&q=%s&sa=Search&siteurl=emacswiki.org%2F", $alternative="http://www.emacswiki.org/");

//org-mode
define_webjump("orgmode-worg","https://www.google.com/cse?cx=002987994228320350715%3Az4glpcrritm&q=%s&sa=Search&siteurl=orgmode.org%2Fworg",$alternative="http://orgmode.org/worg/");

// -----
// Linux
// -----
define_webjump("unix-linux-stackexchange","http://unix.stackexchange.com/search?q=%s", $alternative="http://unix.stackexchange.com");

// -----
// LaTeX
// -----
define_webjump("ctan-desc", "http://www.ctan.org/search/?search=%s&search_type=description");
define_webjump("ctan-file", "http://www.ctan.org/search/?search=%s&search_type=filename");
define_webjump("ctan-pack", "http://www.ctan.org/search/?search=%s&search_type=id");
define_webjump("ctan-all", "http://www.ctan.org/search/?search=%s&search_type=description&search_type=filename&search_type=id");

define_webjump("tex-stackexchange","http://tex.stackexchange.com/search?q=%s", $alternative="http://tex.stackexchange.com");

// ---------
// Reference
// ---------
define_webjump("eol", "http://eol.org/search?q=%s&ie=UTF-8&search_type=text");

require("page-modes/wikipedia.js");

wikipedia_webjumps_format = "wp-%s"; // controls the names of the webjumps.  default is "wikipedia-%s".
define_wikipedia_webjumps("en", "pt"); // 

// sep
define_webjump("sep", "http://plato.stanford.edu/search/searcher.py?query=%s");

// -------------
// Stackoverflow
// -------------
define_webjump("stackoverflow","http://stackoverflow.com/search?q=%s",
$alternative="http://stackoverflow.com");

// ------
// github
// ------
// define_webjump("github", "http://github.com/search?q=%s&type=Everything");

// ========
// Password
// ========
session_pref("signon.rememberSignons", true);
session_pref("signon.expireMasterPassword", false);
session_pref("signon.SignonFileName", "signons.txt");
Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager); // init

// ========
// Favicons
// ========
require("favicon");
//enable favicons modeline
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
//enable favicons in the read_buffer completion list
read_buffer_show_icons = true;

// ================
// Content handlers
// ================
external_content_handlers = 
    {"*":getenv("EDITOR"), 
     text: { "*": getenv("EDITOR") }, 
     image: { "*": "feh -F" }, 
     video: { "*": "mplayer" }, 
     audio: { "*": "mplayer" },
     application: { pdf: "zathura",
		    djvu: "zathura",
		    postscript: "okular", 
		    "x-dvi": "okular"}};


// =====
// Focus
// =====
// strategy 1
require("block-content-focus-change.js");

//strategy 2
// function focusblock (buffer) {
//     var s = Components.utils.Sandbox(buffer.top_frame);
//     s.document = buffer.document.wrappedJSObject;
//     Components.utils.evalInSandbox(
//         "(function () {\
//             function nothing () {}\
//             if (! document.forms)\
//                 return;\
//             for (var i = 0, nforms = document.forms.length; i < nforms; i++) {\
//               for (var j = 0, nels = document.forms[i].elements.length; j < nels; j++)\
//                 document.forms[i].elements[j].focus = nothing;\
//             }\
//           })();",
//         s);
// }
// add_hook('content_buffer_progress_change_hook', focusblock);

//  ======================
//  Integration with Emacs
//  ======================
external_editor_extension_overrides.set("text/plain", "org");
// set the extension of text/plain temp files to .org.

view_source_use_external_editor=true;

define_key(content_buffer_text_keymap, "M-e","edit-current-field-in-external-editor");
// default is C-i. By this key is binded to tab

session_pref('browser.history_expire_days', 10);

session_pref("image.animation_mode", "none");


// define_browser_object_class(
//     "history-url", null, 
//     function (I, prompt) {
//         check_buffer (I.buffer, content_buffer);
//         var result = yield I.buffer.window.minibuffer.read_url(
//             $prompt = prompt,  $use_webjumps = false, $use_history = true, $use_bookmarks = false);
//         yield co_return (result);
//     });

// interactive("find-url-from-history",
//             "Find a page from history in the current buffer",
//             "find-url",
//             $browser_object = browser_object_history_url);

// interactive("find-url-from-history-new-buffer",
//             "Find a page from history in the current buffer",
//             "find-url-new-buffer",
//             $browser_object = browser_object_history_url);

// define_key(content_buffer_normal_keymap, "H", "find-url-from-history-new-buffer");
// define_key(content_buffer_normal_keymap, "h", "find-url-from-history");


add_hook("window_before_close_hook",
         function () {
             var w = get_recent_conkeror_window();
             var result = (w == null) ||
                 "y" == (yield w.minibuffer.read_single_character_option(
                     $prompt = "Quit Conkeror? (y/n)",
                     $options = ["y", "n"]));
             yield co_return(result);
         });

dumpln("END OF RC FILE");

// //command-line fu define_webjump("commandlinefu", function(term) {
// return 'http://www.commandlinefu.com/commands/matching/' +
// term.replace(/[^a-zA-Z0-9_\-]/g, '') .replace(/[\s\-]+/g, '-') + '/' +
// btoa(term); }, $argument = 'optional', $alternative =
// "http://www.commandlinefu.com/"); 

// // show # of buffers being loaded add_hook("mode_line_hook",
// mode_line_adder(loading_count_widget), true);


// // support for pre-loading Conkeror without require("daemon.js");

// // set_protocol_handler("mailto",
// // "https://mail.google.com/mail/?extsrc=mailto&url=%s");

// user_pref("general.warnOnAboutConfig", false);
