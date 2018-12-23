function diff(ary) {
    const newA = [];
    for (var i = 1; i < ary.length; i++)  newA.push(ary[i] - ary[i - 1]);
    return newA;
}

function rle(nums) {
    const lengths = [1];
    const values = [nums[0]];
    nums.slice(1).forEach(n => {
        if (n == values[values.length - 1]) {
            lengths[lengths.length - 1]++;
        } else {
            values.push(n);
            lengths.push(1);
        }
    })
    return { lengths: lengths, values: values };
}

function features(nums) {
    const diffs = diff(nums);
    const repeat_lengths = rle(nums).lengths;

    var neg_to_pos_interval = 0;
    var pos_to_neg_interval = 0;
    for (i = 0; i < 18; i++) {
        if ((diffs[i] > 0) && (diffs[i + 1] < 0)) {
            pos_to_neg_interval = pos_to_neg_interval + 1;
        } else if ((diffs[i] < 0) && (diffs[i + 1] > 0)) {
            neg_to_pos_interval = neg_to_pos_interval + 1;
        }
    };

    const repeats_of_repeats = rle(repeat_lengths);
    const repeats_of_non_repeats = repeats_of_repeats.lengths.filter((n, ind) => repeats_of_repeats.values[ind] == 1);

    const as_string = nums.join('');

    return [
        //repeats
        diffs.filter(n => n == 0).length,
        //up
        diffs.filter(n => n == 1).length,
        diffs.filter(n => n == 2).length,
        diffs.filter(n => n == 3).length,
        diffs.filter(n => n == 4).length,
        //down
        diffs.filter(n => n == -1).length,
        diffs.filter(n => n == -2).length,
        diffs.filter(n => n == -3).length,
        diffs.filter(n => n == -4).length,
        //longest_repeat
        Math.max(...repeat_lengths),
        //first,second,last,second_last
        nums[0],
        nums[1],
        nums[19],
        nums[18],
        //mean_absolute_value_interval
        diffs.map(Math.abs).reduce((prev, current) => current + prev) / diffs.length,
        //ones,twos,threes,f,f
        nums.filter(n => n == 1).length,
        nums.filter(n => n == 2).length,
        nums.filter(n => n == 3).length,
        nums.filter(n => n == 4).length,
        nums.filter(n => n == 5).length,
        //longest_non_repeat
        Math.max(0, ...repeats_of_non_repeats),
        neg_to_pos_interval,
        pos_to_neg_interval,
        //first_4_multiples
        (function () {
            const numOfEach = [0, 0, 0, 0, 0];
            nums.slice(0, 4).forEach(n => numOfEach[n - 1]++);
            return Math.max(...numOfEach);
        })(),
        //first_5_multiples
        (function () {
            const numOfEach = [0, 0, 0, 0, 0];
            nums.slice(0, 5).forEach(n => numOfEach[n - 1]++);
            return Math.max(...numOfEach);
        })(),
        //longest_non_consecutive_and_non_repeat
        (function () {
            const is_big_jump_sequence = diffs.map(n => Math.abs(n) > 1);
            const the_rle = rle(is_big_jump_sequence);
            const lengths_of_non_c_and_non_r = the_rle.lengths.filter((n, ind) => !the_rle.values[ind]);
            return Math.max(0, ...lengths_of_non_c_and_non_r);
        })(),
        //includes_?
        (as_string.match(/123/g) || []).length,
        (as_string.match(/321/g) || []).length,
        (as_string.match(/12345/g) || []).length,
        (as_string.match(/54321/g) || []).length,
        (as_string.match(/513/g) || []).length
    ];
}

// test: should be true
features([4, 5, 1, 3, 5, 5, 2, 4, 1, 3, 2, 5, 3, 3, 1, 2, 4, 3, 2, 5]).join() ==
    "2,2,5,2,0,3,2,2,1,2,4,5,5,2,1.8421052631578947,3,4,5,3,5,6,6,5,1,2,2,0,0,0,0,1";
features([1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1]).join() ==
    "3,8,0,0,0,8,0,0,0,2,1,2,1,2,0.8421052631578947,4,4,4,4,4,4,0,0,1,1,19,2,2,2,2,0";

function validateString(str) {
    if (!str.split("").every(n => ['1', '2', '3', '4', '5'].includes(n))) {
        return { valid: false, message: "Only digits from 1 to 5 are allowed" };
    } else if (str.length != 20) {
        return { valid: false, message: "Length of sequence: " + str.length + " / 20" };
    } else {
        const res = { valid: true, sequence: str.split("").map(n => n.toString()) }
        res.fea = features(res.sequence);
        res.prediction = classifier.predict(res.fea);
        res.message = "Probability human: " + (1 -res.prediction)*100 + "%";
        return res;
    }
}
//alert(new RandomForestClassifier().predict([2,2,3,0,2,6,2,2,0,2,5,2,5,1,1.68421052631579,5,4,4,4,3,11,6,4,1,1,4,2,1,1,1,1,1,1,1,1,0,1,0,0,0]))