/*THIS IS THE JS.COM*/

const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;


let panelButton, panelButtonText, testButton, timeout;
var binlist = [];
let lastwm;

function checkButton() {
    

    
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('wmctrl -l');

    if (lastwm != out.toString()) {
    var arr = out.toString().split('\n');
    for (let g = 0; g < binlist.length; g++) {
        Main.panel._leftBox.remove_child(binlist[g]);
    }
    binlist = [];
    for (let y = 0; y < arr.length; y++) {
        let btn = new St.Button({style_class: "examplePanelText", label: (arr[y].substring(20)+"\t")});
        binlist.push(btn);
        Main.panel._leftBox.insert_child_at_index(btn, y+1);
    }

   /*
    if (panelButtonText.get_checked()) {
        panelButtonText.set_label("Pressed");
    } else {
        panelButtonText.set_label("Not Pressed")
    }
    */
    lastwm = out.toString();
}
    return true;

}

function init() {

    
    /*
    panelButtonText = new St.Button({
        style_class: "examplePanelText",
        label: "ButtonText"
    });
    panelButtonText.set_toggle_mode(true);

    */
}

function enable() {
    //Main.panel._leftBox.insert_child_at_index(panelButtonText, 0);
    timeout = Mainloop.timeout_add_seconds(0.25, checkButton)
}

function disable() {
    Mainloop.source_remove(timeout);
    for (let g = 0; g < binlist.length; g++) {
        Main.panel._leftBox.remove_child(binlist[g]);
    }
    binlist = [];
}
