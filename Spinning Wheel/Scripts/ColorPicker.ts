module ColorPicker {
    var availableColors: Array<string> = ["#FFDFFF", "#F4D2F4", "#EFD7FF", "#EDDFFB", "#E3E0FA", "#E0EAF8", "#C9EAF3",
                                        "#FFECFF", "#F4D2F4", "#F9EEFF", "#F5EEFD", "#EFEDFC", "#EAF1FB", "#DBF0F7",
                                        "#FFDFDF", "#FFDFF8", "#FFDFEF", "#FFDBFB", "#F9D9FF", "#F4DCFE", "#E6DBFF",
                                        "#FFECEC", "#FFEEFB", "#FFECF5", "#FFEEFD", "#FDF2FF", "#FAECFF", "#F1ECFF",
                                        "#E1E1FF", "#DBEBFF", "#ECFAFF", "#C0F7FE", "#E1FFFE", "#BDFFEA", "#EAFFEF",
                                        "#EEEEFF", "#ECF4FF", "#F9FDFF", "#E6FCFF", "#F2FFFE", "#CFFEF0", "#EAFFEF",
                                        "#E3FBE9", "#E9F1EA", "#EAFEE2", "#D2FFC4", "#E8FFD9", "#FFFFD7", "#FAFBDF",
                                        "#E3FBE9", "#F3F8F4", "#F1FEED", "#E7FFDF", "#F2FFEA", "#FFFFE3", "#FCFCE9"];
    var unavailableColors: Array<string> = [];

    export function RandomColor() {
        if (availableColors.length > 0) {
            var rndColorNumb: number = Math.floor(Math.random() * availableColors.length);

            var color: string = availableColors[rndColorNumb];
            availableColors.splice(rndColorNumb, 1);
            unavailableColors.push(color);

            return color;
        } else {
            return "white";
        }
    }

    export function ClearSelected() {
        for (var i = 0; i < unavailableColors.length; i++) {
            var color = unavailableColors[i];
            availableColors.push(color);
        }
        unavailableColors = [];
    }
}