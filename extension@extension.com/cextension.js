const {St, Clutter, GLib, GObject} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const HEIGHT = 40;
let panelButton, panelButtonText, testButton, timeout;
let lastwm;
let container;

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
    container.remove_all_children();

    for (let y = 0; y < arr.length; y++) {
        let btn = new Tab()
        btn.set_label(arr[y].substring(20));
        btn.set_track_hover(true);
        container.insert_child_at_index(btn, 2);
        container.insert_child_at_index(btn, 3);
    }

   

    lastwm = out.toString();
}
return true;
}


function init() {
    let monitor = Main.layoutManager.primaryMonitor;

    container = new Clutter.Actor({
        reactive: true,
        can_focus: true,
        track_hover: true,
        height: HEIGHT,
        width: monitor.width,
    });

    container.background_color = new Clutter.Color.c_new(0, 0, 0, 0);
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
    timeout = Mainloop.timeout_add_seconds(0.33, checkButton);
}

function disable() {
    container.remove_all_children();
    Main.layoutManager.removeChrome(container);
    lastwm = "\n";
    Mainloop.source_remove(timeout);
}
