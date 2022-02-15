/*THIS IS THE JAVASCRIPT.COM*/
const {St, Clutter, GLib, GObject, Shell} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const HEIGHT = 50;
let panelButton, panelButtonText, testButton;
let lastwm;
let appSystem, appStateChangedid;
let container, box, layout, cntnr;

var Tab = GObject.registerClass({
    GtypeName: "Tab",
}, class Tab extends St.Button {
    _init(app) {
        this.app = app;
        super._init({
            style_class: 'examplePanelText',
            label: this.app.get_name(),
            reactive: true
        });
        //this.set_child(this.app.get_icon());
        this.connect("clicked", this.onclick.bind(this));
        this.connect('destroy', this.onDestroy.bind(this));
    }
    onclick(clicked_button) {
        this.app.get_windows()[0].activate(1000000);
    }

    onDestroy() {
        cntnr.remove_child(this);
    }

    getapp() {
        return this.app;
    }
}
);


function init() {
    
    let monitor = Main.layoutManager.primaryMonitor;
    tablist = [];
    layout = new Clutter.BoxLayout({homogeneous: true});
    container = new St.Widget({
        style_class: "bg-color",
        reactive: true,
        can_focus: true,
        layout_manager: new Clutter.BinLayout(),
        track_hover: true,
        height: HEIGHT,
        width: monitor.width,
    });
    box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
    });
    cntnr = new St.Widget({
        style_class: "bg-color",
        reactive: true,
        layout_manager: layout,
        x_align: Clutter.ActorAlign.START,
        x_expand: true,
        y_expand: true,
    });
    
    container.add_actor(box);
    box.add_child(cntnr);
    appSystem = Shell.AppSystem.get_default();
    appStateChangedid = appSystem.connect("app-state-changed", onChange.bind(cntnr));
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
}

function disable() {
    cntnr.remove_all_children();
    Main.layoutManager.removeChrome(container);
}

function onChange(appSys, app) {
    if (app.state === Shell.AppState.RUNNING) {
        let btn = new Tab(app);
        btn.set_track_hover(true);
        cntnr.insert_child_at_index(btn, 0);
    } else if (app.state === Shell.AppState.STOPPED) {
        let children = cntnr.get_children();
        let child = children.find(c => c.getapp() === app);
        if (child) {
            child.destroy();
        }
    }
}