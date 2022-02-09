const WindowList = GObject.registerClass(
class WindowList extends St.Widget {
    _init(monitor) {
        
        super.init({
            name: 'panel',
            style_class: 'bottom-panel solid',
            reactive: true,
            track_hover: true,
            layout_manager: new Clutter.BinLayout(),
        });
        
        this._windowList = new St.Widget({
            style_class: 'window-list',
            reactive: true,
            layout_manager: new Clutter.BoxLayout({ homogeneous: true });,
            x_align: Clutter.ActorAlign.START,
            x_expand: true,
            y_expand: true,
        });
        
        this._monitor = monitor
        this.width = this._monitor.width;
        
        let box = new St.BoxLayout({x_expand: true, y_expand: true});
        this.add_actor(box);
        box.add_child(this._windowList);
    }
});



function enable() {
    new WindowList(Main.layoutManager.primaryMonitor);
}
