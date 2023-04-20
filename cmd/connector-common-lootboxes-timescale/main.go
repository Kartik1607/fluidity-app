package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
)

func main() {
	queue.LootboxesAll(func(lootbox lootboxes.Lootbox) {
		lootboxes.InsertLootbox(lootbox) 
	})
}
