/*THIS IS THE JS.COM*/

const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;


let panelButton, panelButtonText, testButton, timeout;
var binlist = [];
let lastwm;



var Tab = GObject.registerClass({
    GtypeName: "Tab",
}, class Tab extends St.Button {
    _init() {
        super._init({
            style_class: 'examplePanelText',
            reactive: true
        });
        this.connect("clicked", this.onclick.bind(this));
    }
    onclick(clicked_button) {
        let [ok, out, err, exit] = GLib.spawn_command_line_sync(`wmctrl -a ${this.get_label()}`);
    }
}
);


function checkButton() {
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('wmctrl -l');
    
    if (lastwm != out.toString()) {
    var arr = out.toString().split('\n');
    arr.pop();
    /*
    for (let g = 0; g < binlist.length; g++) {
        Main.panel._leftBox.remove_child(binlist[g]);
    }
    */
    Main.panel._leftBox.remove_all_children();
    binlist = [];

    for (let y = 0; y < arr.length; y++) {
        let btn = new Tab()
        btn.set_label(arr[y].substring(20));
        btn.set_track_hover(true);

        binlist.push(btn);
        Main.panel._leftBox.insert_child_at_index(btn, y);
    }

   

    lastwm = out.toString();
}
/*
for (let y = 0; y < binlist.length; y++) {
    if (binlist[y].get_checked()){
        let [ok, out, err, exit] = GLib.spawn_command_line_sync(`wmctrl -a ${binlist[y].get_label()}`);
        binlist[y].set_checked(false);
    }
}
*/
    return true;

}

function init() {
    
}

function enable() {
    timeout = Mainloop.timeout_add_seconds(0.33, checkButton);
}

function disable() {
    lastwm = "\n";
    Mainloop.source_remove(timeout);
}
