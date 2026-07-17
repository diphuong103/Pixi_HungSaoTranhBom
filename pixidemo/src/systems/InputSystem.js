/**
 * systems/InputSystem.js – §8. XỬ LÝ INPUT BÀN PHÍM
 *
 * Trong Java: addKeyListener(new KeyAdapter() { onKeyPressed... })
 * Ở đây dùng Web API: document.addEventListener('keydown'/'keyup', handler).
 * Lưu trạng thái từng phím trong object keys{} để game loop đọc mỗi frame.
 *
 * Pattern: Polling (đọc trạng thái mỗi frame) thay vì Event-driven
 * → Giúp chuyển động mượt hơn so với chỉ dùng event.
 */
export class InputSystem {
    constructor() {
        // Bộ nhớ trạng thái bàn phím – tương đương boolean[] keys trong Java
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
        };

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
    }

    // Callback và onStartGame sẽ được gắn từ bên ngoài
    onStartGame = null;

    _onKeyDown(e) {
        if (e.key in this.keys) this.keys[e.key] = true;

        // Nhấn Space/Enter để bắt đầu hoặc chơi lại
        if ((e.key === ' ' || e.key === 'Enter') && this.onStartGame) {
            this.onStartGame();
        }
    }

    _onKeyUp(e) {
        if (e.key in this.keys) this.keys[e.key] = false;
    }

    /** Dọn dẹp event listeners khi không còn dùng */
    destroy() {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
    }
}
