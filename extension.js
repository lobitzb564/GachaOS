const {St, Clutter} = imports.gi;
const Main = imports.ui.main;

const HEIGHT = 40;

let container;

function init() {
    let monitor = Main.layoutManager.primaryMonitor;

    container = new St.Bin({
        style_class: "bg-color",
        reactive: true,
        can_focus: true,
        track_hover: true,
        height: HEIGHT,
        width: monitor.width,
    });

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
    Main.layoutManager.removeChrome(container);
}