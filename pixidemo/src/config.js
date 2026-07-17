/**
 * config.js – §0. HẰNG SỐ CẤU HÌNH GAME
 *
 * Tập trung tất cả "con số ma thuật" ở một nơi để dễ chỉnh thông số.
 * Trong Java ta thường dùng: static final int PLAYER_SPEED = 5;
 * Ở đây dùng một object xuất ra (export) để các module khác import vào.
 */

export const CONFIG = {
    WIDTH: 480,      // Chiều rộng canvas (px)
    HEIGHT: 640,      // Chiều cao canvas (px)
    PLAYER_SPEED: 5,        // Tốc độ di chuyển trái/phải của người chơi
    PLAYER_W: 60,       // Chiều rộng hình vẽ người chơi
    PLAYER_H: 24,       // Chiều cao hình vẽ người chơi
    SPAWN_INTERVAL: 90,       // Số frame giữa mỗi lần tạo vật thể rơi
    ITEM_SPEED_MIN: 2,        // Tốc độ rơi tối thiểu
    ITEM_SPEED_MAX: 5,        // Tốc độ rơi tối đa
    ITEM_SIZE: 22,       // Kích thước hình vẽ vật thể
    SCORE_PER_STAR: 10,       // Điểm thưởng mỗi ngôi sao hứng được
    BG_COLOR: 0x0d0d1a, // Màu nền canvas (hex của Pixi)
};
