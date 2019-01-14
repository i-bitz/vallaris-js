var datasetNumer = 18;
var apiKey = 'k-c0f629d0-904b-5c85-b3c6-a07ca883ec7f';
var setting = {
    dataset_vector: {
        url: 'https://api.vallaris.space/v2/tile/' + datasetNumer + '/{z}/{x}/{y}?key=' + apiKey,
        zIndex: 500,
        bbox: [100.56473404334055, 14.353387924277769, 100.56919723914135, 14.354427315579315]
    }
};

new vallaris.maps.Map(setting);
