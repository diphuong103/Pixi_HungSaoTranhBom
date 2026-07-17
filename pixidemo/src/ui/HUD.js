/**
 * ui/HUD.js – §6. TẠO HUD – HEADS-UP DISPLAY
 *
 * PIXI.Text ≈ JLabel trong Java Swing:
 * - Hiển thị văn bản trực tiếp lên canvas.
 * - Cập nhật nội dung bằng cách thay đổi thuộc tính .text.
 */
import { Text, TextStyle } from 'pixi.js';

export class HUD {
    constructor(stage) {
        // TextStyle ≈ new Font("Arial", Font.BOLD, 18) trong Java
        const style = new TextStyle({
            fontFamily: 'Segoe UI, Arial',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#ffffff',
            dropShadow: { color: '#7c3aed', blur: 8, distance: 0 },
        });

        this.scoreText = new Text({ text: '⭐ Điểm: 0', style });
        this.scoreText.x = 14;
        this.scoreText.y = 14;

        // Thêm vào Stage – addChild cuối = layer trên cùng
        stage.addChild(this.scoreText);
    }

    /** Cập nhật điểm hiển thị trên HUD */
    setScore(score) {
        this.scoreText.text = `⭐ Điểm: ${score}`;
    }
}
