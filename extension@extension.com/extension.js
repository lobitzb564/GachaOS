/*THIS IS THE JAVASCRIPT.COM*/
const {St, Clutter, GLib, GObject, Shell, Gio} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const HEIGHT = 50;
let panelButton, panelButtonText, testButton;
let lastwm;
let lastind = 0;
let appSystem, appStateChangedid;
let container, box, layout, cntnr;
const Me = imports.misc.extensionUtils.getCurrentExtension();

async function pinthis() {
    let fileexists = Me.dir.get_child("pins.txt").query_exists(null);
    if (!fileexists) {

    }

    let file = Gio.File.new_for_path(Me.path + "/pins.txt");
    
    let [, contents, fetag] = await new Promise((resolve, reject) => {
        file.load_contents_async(
            null,
            (file_, result) => {
                try {
                    resolve(file.load_contents_finish(result));
                } catch(e) {
                    reject(e);
                }
            }
        );
    });
    let tabs = contents.toString().split('\n');
    return contents;
}

var Tab = GObject.registerClass({
    GtypeName: "Tab",
}, class Tab extends St.Button {
    _init(app, index) {
        this.app = app;
        super._init({
            style_class: 'examplePanelText',
            label: this.app.get_name(),
            reactive: true,
            track_hover: true
        });
        this.icon = new St.Icon({gicon: this.app.get_icon()});
        this.set_child(this.icon);
        this.connect("clicked", this.clicked.bind(this));
        this.connect('destroy', this.onDestroy.bind(this));
        this.connect('style-changed', this.mouseov.bind(this));
    }
    clicked(clicked_button) {
        let btnlist = this.app.get_windows();
        if (btnlist.length <= 1){btnlist[0].make_above();
        } else {
            let pop = new Popup(btnlist, this.get_x());

        }
    }

    pintab() {
        let contents = pinthis();
        let newfstr = contents.toString();
        if (!contents.toString().includes(obj.app.get_id())) {
            newfstr += this.app.get_id()+"\n";
        }
        let [, etag] = file.replace_contents(newfstr, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
    }
    

    mouseov() {
    if (this.hover) {
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

var Pinned = GObject.registerClass({
    GTypeName: "Pinned"
}, class Pinned extends Tab {
    _init(appID, index) {
        this.app = Shell.AppSystem.lookup_app(appID);
        this.index = index;
        if (this.app) {
            super._init(this.app, this.index);
            this.connect("clicked", this.clicked.bind(this));
        }
    }

    clicked(clicked_button) {
        this.app.launch();
        this.destroy;
        cntnr.insert_child_at_index(new Tab(this.app, this.index));
    }
});

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
        this.big = new St.Button({
            style_class: 'bigblk',
            reactive: true,
            height: Main.layoutManager.primaryMonitor.height,
            width: Main.layoutManager.primaryMonitor.width 
        });
        Main.layoutManager.addChrome(this.big, {
            affectsInputRegion: true,
            affectsStruts: false,
            trackFullscreen: true,
        });
        Main.layoutManager.addChrome(this, {
            affectsInputRegion: true,
            affectsStruts: false,
            trackFullscreen: true,
        });
        this.big.connect('clicked', this.outsideclk.bind(this));
        this.big.set_position(0, 0);
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


    outsideclk(clicked_button) {
        Main.layoutManager.removeChrome(this);
        Main.layoutManager.removeChrome(this.big);
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
        Main.layoutManager.removeChrome(this.parent.big);
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

    pinthis();
}

function disable() {
    cntnr.remove_all_children();
    Main.layoutManager.removeChrome(container);
}

function onChange(appSys, app) {
    if (app.state === Shell.AppState.RUNNING) {
        let btn = new Tab(app, lastind);
        btn.set_track_hover(true);
        cntnr.insert_child_at_index(btn, lastind);
        lastind++;
    } else if (app.state === Shell.AppState.STOPPED) {
        let children = cntnr.get_children();
        let child = children.find(c => c.getapp() === app);
        if (child) {
            child.destroy();
        }
    }
}