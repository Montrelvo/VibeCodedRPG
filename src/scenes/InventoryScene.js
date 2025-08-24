import { EQUIPMENT_SLOTS } from '../items.js';

class InventoryScene extends Phaser.Scene {
    constructor() {
        super('InventoryScene');
        this.selectedItem = null;
        this.inventorySlots = [];
        this.equipmentSlots = {};
    }

    create() {
        // Get the player instance from registry
        this.player = this.registry.get('player');

        // Background overlay
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setDepth(0);

        // Main inventory panel
        this.inventoryPanel = this.add.rectangle(400, 300, 700, 500, 0x2c2c2c, 1).setDepth(1);
        this.add.text(400, 100, 'Inventory & Equipment', {
            fontSize: '32px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        // Equipment section
        this.createEquipmentSlots();

        // Inventory grid section
        this.createInventoryGrid();

        // Item details panel
        this.createItemDetailsPanel();

        // Buttons
        this.createButtons();

        // Initial update
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
    }

    createEquipmentSlots() {
        // Equipment panel
        this.add.rectangle(150, 200, 200, 400, 0x1a1a1a, 1).setDepth(1);
        this.add.text(150, 150, 'Equipment', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        // Equipment slot positions
        const slotPositions = {
            [EQUIPMENT_SLOTS.WEAPON]: { x: 150, y: 180, label: 'Weapon' },
            [EQUIPMENT_SLOTS.HEAD]: { x: 150, y: 230, label: 'Head' },
            [EQUIPMENT_SLOTS.CHEST]: { x: 150, y: 280, label: 'Chest' },
            [EQUIPMENT_SLOTS.HANDS]: { x: 150, y: 330, label: 'Hands' },
            [EQUIPMENT_SLOTS.LEGS]: { x: 150, y: 380, label: 'Legs' },
            [EQUIPMENT_SLOTS.FEET]: { x: 150, y: 430, label: 'Feet' },
            [EQUIPMENT_SLOTS.ACCESSORY1]: { x: 100, y: 480, label: 'Acc 1' },
            [EQUIPMENT_SLOTS.ACCESSORY2]: { x: 200, y: 480, label: 'Acc 2' }
        };

        // Create equipment slots
        for (const [slot, pos] of Object.entries(slotPositions)) {
            const slotBg = this.add.rectangle(pos.x, pos.y, 60, 60, 0x444444, 1).setDepth(2);
            const slotText = this.add.text(pos.x, pos.y + 35, pos.label, {
                fontSize: '12px',
                fill: '#ffffff'
            }).setOrigin(0.5).setDepth(3);

            slotBg.setInteractive({ useHandCursor: true });
            slotBg.on('pointerdown', () => this.handleEquipmentSlotClick(slot));

            this.equipmentSlots[slot] = {
                background: slotBg,
                text: slotText,
                item: null,
                sprite: null
            };
        }
    }

    createInventoryGrid() {
        // Inventory panel
        this.add.rectangle(550, 300, 400, 400, 0x1a1a1a, 1).setDepth(1);
        this.add.text(550, 150, 'Inventory', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        // Create inventory grid (4x5)
        const startX = 450;
        const startY = 200;
        const slotSize = 50;
        const padding = 10;

        this.inventorySlots = [];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                const x = startX + (col * (slotSize + padding));
                const y = startY + (row * (slotSize + padding));

                const slotBg = this.add.rectangle(x, y, slotSize, slotSize, 0x333333, 1).setDepth(2);
                slotBg.setInteractive({ useHandCursor: true });

                const slotIndex = row * 5 + col;
                slotBg.on('pointerdown', () => this.handleInventorySlotClick(slotIndex));

                this.inventorySlots.push({
                    background: slotBg,
                    item: null,
                    sprite: null,
                    index: slotIndex
                });
            }
        }
    }

    createItemDetailsPanel() {
        // Item details panel
        this.add.rectangle(150, 550, 200, 100, 0x1a1a1a, 1).setDepth(1);
        this.itemNameText = this.add.text(150, 530, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2);

        this.itemStatsText = this.add.text(150, 550, '', {
            fontSize: '12px',
            fill: '#cccccc'
        }).setOrigin(0.5).setDepth(2);

        this.itemDescText = this.add.text(150, 570, '', {
            fontSize: '10px',
            fill: '#999999'
        }).setOrigin(0.5).setDepth(2);
    }

    createButtons() {
        // Close button
        const closeButton = this.add.text(700, 500, 'Close', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#007bff'
        }).setPadding(10).setOrigin(0.5).setDepth(3);

        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => {
            this.scene.stop('InventoryScene');
            this.scene.resume('GameScene');
        });

        // Equip/Unequip button
        this.actionButton = this.add.text(150, 500, 'Equip', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#28a745'
        }).setPadding(8).setOrigin(0.5).setDepth(3);

        this.actionButton.setInteractive({ useHandCursor: true });
        this.actionButton.on('pointerdown', () => this.handleActionButton());
        this.actionButton.setVisible(false);
    }

    updateInventoryDisplay() {
        const inventory = this.player.getInventory();

        // Clear existing sprites
        this.inventorySlots.forEach(slot => {
            if (slot.sprite) {
                slot.sprite.destroy();
                slot.sprite = null;
            }
            slot.item = null;
        });

        // Add items to slots
        inventory.forEach((item, index) => {
            if (index < this.inventorySlots.length) {
                const slot = this.inventorySlots[index];
                slot.item = item;

                // Create item sprite (circle with rarity color)
                slot.sprite = this.add.circle(slot.background.x, slot.background.y, 20, item.rarity.color, 1).setDepth(3);
            }
        });
    }

    updateEquipmentDisplay() {
        const equipment = this.player.getEquippedItems();

        // Clear existing sprites
        for (const slot of Object.values(this.equipmentSlots)) {
            if (slot.sprite) {
                slot.sprite.destroy();
                slot.sprite = null;
            }
            slot.item = null;
        }

        // Add equipped items
        for (const [slotType, item] of Object.entries(equipment)) {
            if (item && this.equipmentSlots[slotType]) {
                const slot = this.equipmentSlots[slotType];
                slot.item = item;

                // Create item sprite
                slot.sprite = this.add.circle(slot.background.x, slot.background.y, 20, item.rarity.color, 1).setDepth(3);
            }
        }
    }

    handleInventorySlotClick(slotIndex) {
        const slot = this.inventorySlots[slotIndex];
        if (slot.item) {
            this.selectItem(slot.item, 'inventory', slotIndex);
        }
    }

    handleEquipmentSlotClick(slotType) {
        const slot = this.equipmentSlots[slotType];
        if (slot.item) {
            this.selectItem(slot.item, 'equipment', slotType);
        }
    }

    selectItem(item, source, sourceIndex) {
        this.selectedItem = {
            item: item,
            source: source,
            sourceIndex: sourceIndex
        };

        // Update item details
        this.itemNameText.setText(`${item.rarity.name} ${item.name}`);
        this.itemStatsText.setText(this.formatItemStats(item.stats));
        this.itemDescText.setText(item.description);

        // Show action button
        this.actionButton.setVisible(true);
        this.actionButton.setText(source === 'inventory' ? 'Equip' : 'Unequip');
    }

    handleActionButton() {
        if (!this.selectedItem) return;

        const { item, source, sourceIndex } = this.selectedItem;

        if (source === 'inventory') {
            // Try to equip the item
            const equipped = this.player.equipItem(item);
            if (equipped) {
                this.updateInventoryDisplay();
                this.updateEquipmentDisplay();
                this.clearSelection();
            }
        } else {
            // Try to unequip the item
            const unequipped = this.player.unequipItem(sourceIndex);
            if (unequipped) {
                this.updateInventoryDisplay();
                this.updateEquipmentDisplay();
                this.clearSelection();
            }
        }
    }

    clearSelection() {
        this.selectedItem = null;
        this.itemNameText.setText('');
        this.itemStatsText.setText('');
        this.itemDescText.setText('');
        this.actionButton.setVisible(false);
    }

    formatItemStats(stats) {
        const statLines = [];
        for (const [stat, value] of Object.entries(stats)) {
            const displayName = stat.charAt(0).toUpperCase() + stat.slice(1);
            statLines.push(`${displayName}: +${value}`);
        }
        return statLines.join('\n');
    }
}

export { InventoryScene };