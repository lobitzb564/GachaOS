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
            reactive: true,
            track_hover: true
        });
        this.icon = new St.Icon({gicon: this.app.get_icon()});
        this.label = new St.Label({style_class: "examplePanelText", text: this.app.get_name()});
        this.set_child(this.icon);
        this.connect("clicked", this.onclick.bind(this));
        this.connect('destroy', this.onDestroy.bind(this));
        this.connect('style-changed', this.mouseov.bind(this));
    }
    onclick(clicked_button) {
        let btnlist = this.app.get_windows();
        if (btnlist.length <= 1){btnlist[0].make_above();
        } else {
            let pop = new Popup(btnlist, this.get_x());

        }
    }

    mouseov() {
    if (this.hover) {
        this.remove_all_children();
        this.set_label(this.app.get_name());
    } else {
    this.set_child(this.icon);
    }
    }

    onDestroy() {
        cntnr.remove_child(this);
    }

    getapp() {
        return this.app;
    }
}
);

var Popup = GObject.registerClass({
    GtypeName: "Popup",
}, class Popup extends St.Widget {
    _init(btnlist, xpos) {
        this.btnlist = btnlist;
        super._init({
            style_class: 'bg-popup',
            reactive: true,
            can_focus: true,
            layout_manager: new Clutter.BinLayout(),
            track_hover: true,
            height: ((btnlist.length*30)),
            width: 190,
        });
        Main.layoutManager.addChrome(this, {
            affectsInputRegion: true,
            affectsStruts: false,
            trackFullscreen: true,
        });
        let bx =new St.BoxLayout({vertical: true});
        this.add_actor(bx);
        this.set_position(xpos, Main.layoutManager.primaryMonitor.height-HEIGHT-this.height);
        for (let i = 0; i < btnlist.length; i++) {
            let p = new Popupwin(btnlist[i], this);
            p.set_track_hover(true);
            bx.insert_child_at_index(p, 0);
        }
        //this.connect("clicked", this.onclick.bind(this));
    }
  }
);

var Popupwin = GObject.registerClass({
    GtypeName: "Popupwin",
}, class Popupwin extends St.Button {
    _init(win, parent) {
        this.win = win;
        this.parent = parent;
        super._init({
            style_class: "epopupwin",
            reactive: true,
            label: win.get_title(),
        });
        
        this.connect("clicked", this.onclick.bind(this));
    }
    onclick(clicked_button) {
        this.win.make_above();
        Main.layoutManager.removeChrome(this.parent);
    }
}
);

function init() {
    
    let monitor = Main.layoutManager.primaryMonitor;
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