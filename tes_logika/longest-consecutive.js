function longestConsecutive(nums) {
    let numSet = new Set(nums);
    let longestStreak = 0;

    for (let num of numSet) {
        if (!numSet.has(num - 1)) {  // Ini adalah awal dari suatu urutan
            let currentNum = num;
            let currentStreak = 1;

            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }

            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }

    return longestStreak;
}

// Test case
console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
// Output: 4 (urutan terpanjang adalah [1, 2, 3, 4])
