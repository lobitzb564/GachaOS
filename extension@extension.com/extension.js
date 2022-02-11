const {St, Clutter, GLib, GObject} = imports.gi;
const Main = imports.ui.main;
const fs = require(fs);
const Mainloop = imports.mainloop;

const HEIGHT = 50;
let panelButton, panelButtonText, testButton, timeout;
let lastwm;
let container, box, layout;

var Tab = GObject.registerClass({
    GtypeName: "Tab",
}, class Tab extends St.Button {
    constructor() {
        this.open = false;
    }
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
    box.remove_all_children();

    for (let y = 0; y < arr.length; y++) {
        let btn = new Tab()
        btn.set_label(arr[y].substring(20));
        btn.set_track_hover(true);
        box.insert_child_at_index(btn, y);
    }

   

    lastwm = out.toString();
}
return true;
}


function init() {
    let monitor = Main.layoutManager.primaryMonitor;

    layout = new Clutter.BoxLayout({homogeneous: true});
    container = new St.Widget({
        style_class: "bg-color",
        reactive: true,
        can_focus: true,
        layout_manager: layout,
        track_hover: true,
        height: HEIGHT,
        width: monitor.width,
    });
    box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
    });
    container.add_actor(box);

    container.set_position(0, monitor.height - HEIGHT);

    container.connect("enter-event", () => {
        log('entered');
    });

    container.connect("leave-event", () => {
        log('left');
    });

    container.connect("button-press-event", () => {
        log('pressed');
    });
}

function enable() {
    Main.layoutManager.addChrome(container, {
        affectsInputRegion: true,
        affectsStruts: true,
        trackFullscreen: true,
    });
    timeout = Mainloop.timeout_add_seconds(0.25, checkButton);
}

function disable() {
    box.remove_all_children();
    Main.layoutManager.removeChrome(container);
    lastwm = "\n";
    Mainloop.source_remove(timeout);
}