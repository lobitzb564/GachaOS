/*this is the js.com*/
const {St, Clutter, GLib, GObject, Shell, Gio, GSound, GstAudio, Gst} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const HEIGHT = 800;
const WIDTH = 800;
let b = 0;
let factor = 5.0;

let player = global.display.get_sound_player();

let minifactor;
let mwind, wheel, timer, time2;
let songs = ["/hd.ogg", "/aven.ogg"];
let cancel;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Manager = Me.imports.manager;

function init() {
    mwind = new St.Widget ({
        style_class: "Background", 
        width: WIDTH, 
        height: HEIGHT, 
        reactive: true, 
        can_focus: true, 
        layout_manager: new Clutter.BinLayout(), 
        track_hover: true
    });
    
    mwind.set_position( (Main.layoutManager.primaryMonitor.width-WIDTH)/2,(Main.layoutManager.primaryMonitor.height-HEIGHT)/2);
    wheel = new St.Icon({style_class: "wheel", reactive: true});
}

function enable() {
    factor = 10;
    buffertime = 0;
    minifactor = .002;
    Main.layoutManager.addChrome(mwind, {
        affectsInputRegion: false,
        affectsStruts: true,
        trackFullscreen: true,
    });


    let mgr = new Manager.Manager();
    mgr.loadSounds();
    

    player.play_from_theme("phone-incoming-call", "weird", cancel);

    

    mwind.add_child(wheel);
    timer = Mainloop.timeout_add(50, rotateWheel);
    wheel.set_pivot_point(0.5, 0.5); 
}

function disable() {
    Mainloop.source_remove(timer);
    cancel.cancel();
    Main.layoutManager.removeChrome(mwind);
}


function rotateWheel() {
    wheel.set_rotation_angle(Clutter.RotateAxis.Z_AXIS, (wheel.get_rotation_angle(Clutter.RotateAxis.Z_AXIS)+factor)%360);
    factor -= minifactor;
    minifactor *= 1.05;
    if (factor <= 0) {
        Mainloop.source_remove(timer);
        time2 = Mainloop.timeout_add_seconds(1.0, timeafter);
    }
    return true;
}

function timeafter() {
    buffertime++;
    if (buffertime > 2) {
        Main.layoutManager.removeChrome(mwind);
        Mainloop.source_remove(time2);
    }
    return true;
}