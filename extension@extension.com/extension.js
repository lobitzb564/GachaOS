/*THIS IS THE JAVASCRIPT.COM*/
const {St, Clutter, GLib, GObject, Shell, Gio} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const HEIGHT = 50;
let panelButton, panelButtonText, testButton;
let lastwm;
let pinnedlist;
let lastind = 0;
let appSystem, appStateChangedid;
let container, box, layout, cntnr;
const Me = imports.misc.extensionUtils.getCurrentExtension();





async function getpins() {
    let fileexists = Me.dir.get_child("pins.txt").query_exists(null);
    if (!fileexists) {
        return;
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
    let tabs = contents.toString();
    return tabs;
}



async function insertp(thi) {
    let str = await getpins();
    if (str.includes(thi.app.get_id())) {
      thi.bx.insert_child_at_index(thi.unpinbtn, 0);
    } else {
        thi.bx.insert_child_at_index(thi.pinbtn, 0);
    }
}


async function unpinthis(newapp) {
    let fileexists = Me.dir.get_child("pins.txt").query_exists(null);
    if (!fileexists) {
        return;
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
    let tabs = contents.toString();
    let regexs = newapp.get_id() + "\n";
    tabs = tabs.replace(regexs, "");
    let [, etag] = file.replace_contents(tabs, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
    return;
}


async function pinthis(newapp) {
    let fileexists = Me.dir.get_child("pins.txt").query_exists(null);
    if (!fileexists) {
        return;
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
    let tabs = contents.toString();
    if (!tabs.includes(newapp.get_id())) {
        tabs += newapp.get_id()+"\n";
    }
    let [, etag] = file.replace_contents(tabs, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
    return;
}

async function pint(check) {
    let fileexists = Me.dir.get_child("pins.txt").query_exists(null);
    if (!fileexists) {
        return;
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
    let tabs = contents.toString();
    let b;
    tabs.includes(check.get_id()) ? b = true : b = false;
    return b;
}

async function initpins() {
    let hg = await getpins();
    let p = hg.split("\n");
    for (let i = 0; i < p.length; i++) {
        cntnr.insert_child_at_index(new Tab(Shell.AppSystem.get_default().lookup_app(p[i])), 0);
    }
    return;
}


var Tab = GObject.registerClass({
    GtypeName: "Tab",
}, class Tab extends St.Button {
    _init(app) {
        this.app = app;
        this.pinned = true;
        super._init({
            style_class: 'examplePanel',
            label: this.app.get_name(),
            reactive: true,
            track_hover: true,
            button_mask: St.ButtonMask.ONE | St.ButtonMask.THREE | St.ButtonMask.TWO
        });
        if (this.app.state === Shell.AppState.RUNNING) {
            this.set_style_class_name("examplePanelText");
        }
        this.icon = new St.Icon({gicon: this.app.get_icon()});
        this.set_child(this.icon);
        this.connect("clicked", this.clicked.bind(this));
        this.connect('destroy', this.onDestroy.bind(this));
        this.connect('style-changed', this.mouseov.bind(this));
    }
    clicked(actor, clicked_button) {

        if (clicked_button === 1) {
            if (this.app.state === Shell.AppState.RUNNING) {
                let btnlist = this.app.get_windows();
                if (btnlist.length <= 1){
                    let win = btnlist[0];
                       win.make_above();
                } else {
                  let pop = new Popup(btnlist, this.get_x());
                }
            } else if (this.app.state === Shell.AppState.STOPPED) {
                this.set_style_class_name("examplePanelText");
                this.app.activate();
                this.app.get_windows()[0].make_above();
                this.pinned = false;
            }
    } else {
        let nm = new RCPopup(this.get_x(), this.app, this);
    }
        this.set_label(this.get_label());
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

var RCPopup = GObject.registerClass({
    GTypeName: "RCPopup"
}, class RCPopup extends St.Widget {
    _init(xpos, app, parent) {
        this.app = app;
        this.parent = parent;
        super._init({
            style_class: 'bg-popup',
            reactive: true,
            can_focus: true,
            layout_manager: new Clutter.BinLayout(),
            track_hover: true,
            height: 60,
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
        this.bx = new St.BoxLayout({vertical: true});
        this.add_actor(this.bx);
        this.set_position(xpos, Main.layoutManager.primaryMonitor.height-HEIGHT-this.height);
        this.pinbtn = new St.Button ({style_class: "epopupwin", height: 30, width: 190, label: "Pin window", reactive:true});
        this.unpinbtn = new St.Button ({style_class: "epopupwin", height: 30, width: 190, label: "Unpin window", reactive:true});
        this.closebtn = new St.Button ({style_class: "epopupwin", height: 30, width: 190, label: "Close window", reactive: true});
        this.openbtn = new St.Button ({style_class: "epopupwin", height: 30, width: 190, label: "Open window", reactive: true});
        this.closebtn.connect("clicked", this.close.bind(this));
        this.openbtn.connect("clicked", this.openwin.bind(this));
        this.pinbtn.connect("clicked", this.pinatab.bind(this));
        this.unpinbtn.connect("clicked", this.unpin.bind(this));

        if (this.app.state === Shell.AppState.RUNNING) {
            this.bx.insert_child_at_index(this.closebtn, 0);
        } else {
            this.bx.insert_child_at_index(this.openbtn, 0);
        }

        insertp(this);
    }
    outsideclk(clicked_button) {
        Main.layoutManager.removeChrome(this);
        Main.layoutManager.removeChrome(this.big);
    }
    close(actor, clicked_button) {
        this.app.request_quit();
        Main.layoutManager.removeChrome(this.big);
        this.destroy();
    }
    openwin(actor, clicked_button) {
        Main.layoutManager.removeChrome(this.big);
        this.destroy();
        this.app.activate();
        this.app.get_windows()[0].make_above();
    }
    pinatab(actor, clicked_button) {
        pinthis(this.app);
        Main.layoutManager.removeChrome(this.big);
        this.destroy();
    }
    unpin(actor, clicked_button) {
        unpinthis(this.app);
        Main.layoutManager.removeChrome(this.big);
        if (this.app.state === Shell.AppState.STOPPED) {
            this.parent.destroy();
        }
        this.destroy();
        let childrn = cntnr.get_children();
        if (childrn.length * 190 > Main.layoutManager.primaryMonitor.width) {
            for (let u = 0; u < childrn.length; u++) {
                childrn[u].width = (Main.layoutManager.primaryMonitor.width/childrn.length);
            }
        } else {
            for (let u = 0; u < childrn.length; u++) {
                childrn[u].width = 190;
            }
        }
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
    pinnedlist = pinthis();
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

       initpins(); 
}

function disable() {
    Main.layoutManager.removeChrome(container);
    cntnr.remove_all_children();
}

async function onChange(appSys, app) {
    let plist = await getpins();
    if (app.state === Shell.AppState.RUNNING) {
        if (!plist.includes(app.get_id())) {
            
            let btn = new Tab(app);
            btn.set_track_hover(true);
            cntnr.insert_child_at_index(btn, 0);
            let children = cntnr.get_children();
            if (children.length * 190 > Main.layoutManager.primaryMonitor.width) {
                for (let u = 0; u < children.length; u++) {
                    children[u].width = (Main.layoutManager.primaryMonitor.width/children.length);
                }
            }
        } else {
            let children = cntnr.get_children();
            let child = children.find(c => c.getapp() === app);
            if (child) {
                child.set_style_class_name("examplePanelText");
            }
        }
    } else if (app.state === Shell.AppState.STOPPED) {
        if (!plist.includes(app.get_id())) {
        let children = cntnr.get_children();
        let child = children.find(c => c.getapp() === app);
        if (child) {
            child.destroy();
        }
        let childrn = cntnr.get_children();
            if (childrn.length * 190 > Main.layoutManager.primaryMonitor.width) {
                for (let u = 0; u < childrn.length; u++) {
                    childrn[u].width = (Main.layoutManager.primaryMonitor.width/childrn.length);
                }
            } else {
                for (let u = 0; u < childrn.length; u++) {
                    childrn[u].width = 190;
                }
            }
    } else {
        let children = cntnr.get_children();
        let child = children.find(c => c.getapp() === app);
        if (child) {
            child.set_style_class_name("examplePanel");
        }
    }
    }
}
