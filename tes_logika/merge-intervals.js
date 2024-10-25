function mergeIntervals(intervals) {
    if (intervals.length === 0) return [];

    // Urutkan interval berdasarkan nilai awal
    intervals.sort((a, b) => a[0] - b[0]);

    let merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        let prev = merged[merged.length - 1];
        let curr = intervals[i];

        if (prev[1] >= curr[0]) {
            // Gabungkan interval jika ada tumpang tindih
            prev[1] = Math.max(prev[1], curr[1]);
        } else {
            merged.push(curr);
        }
    }

    return merged;
}

// Test case
console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
// Output: [[1,6],[8,10],[15,18]]
