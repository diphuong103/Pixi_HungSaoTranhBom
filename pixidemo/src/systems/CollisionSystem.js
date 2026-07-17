/**
 * systems/CollisionSystem.js – §11d. PHÁT HIỆN VA CHẠM AABB
 *
 * AABB = Axis-Aligned Bounding Box
 * Thuật toán: hai hình chữ nhật va chạm nếu chúng "lồng" vào nhau
 *             theo cả 2 trục X và Y đồng thời.
 * Trong Java: playerRect.intersects(itemRect) làm điều tương tự.
 */
import { CONFIG } from '../config.js';

export class CollisionSystem {
    /**
     * Kiểm tra AABB giữa player và một item
     * @param {PIXI.Container} player
     * @param {PIXI.Graphics}  item
     * @returns {boolean}
     */
    static check(player, item) {
        // Player bounding box (hệ tọa độ thế giới, pivot đặt tại giữa-dưới)
        const px1 = player.x - CONFIG.PLAYER_W / 2;
        const px2 = player.x + CONFIG.PLAYER_W / 2;
        const py1 = player.y - CONFIG.PLAYER_H;
        const py2 = player.y;

        // Item bounding box (tọa độ gốc item.x/item.y tại tâm)
        const ix1 = item.x - CONFIG.ITEM_SIZE / 2;
        const ix2 = item.x + CONFIG.ITEM_SIZE / 2;
        const iy1 = item.y - CONFIG.ITEM_SIZE / 2;
        const iy2 = item.y + CONFIG.ITEM_SIZE / 2;

        // Va chạm khi hai hộp lồng nhau trên cả hai trục
        return px1 < ix2 && px2 > ix1 && py1 < iy2 && py2 > iy1;
    }
}
