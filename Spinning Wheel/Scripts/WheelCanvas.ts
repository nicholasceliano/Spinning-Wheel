module WheelCanvas {
    var spinnerSlices: Array<PieSlice> = null;

    export function BuildWheel(slices: Array<PieSlice>, updateWheel:boolean, rotationAdjustment = 0) {
        if (spinnerSlices == null || updateWheel)
            spinnerSlices = slices;

        //see if I can name the sections and just move them without having to redraw them?
        var c: any = document.getElementById("cvsWheel");
        c.height = 300;
        
        var ctx = c.getContext("2d"),
            sliceCt = spinnerSlices.length,
            cX = 150,
            cY = 150,
            radius = 140,
            fontSize = 12,
            fontColor = "blue",
            fontStyle = "Arial",
            textPaddingRight = 15,
            selectedSlice: number = null;
        
        //Build slice selector pointer
        ctx.moveTo(cX + radius + 9, cY + 5);
        ctx.lineTo(cX + radius + 9, cY - 5);
        ctx.lineTo(cX + radius, cY);
        ctx.lineTo(cX + radius + 9, cY + 5);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();

        for (var i = 0; i < sliceCt; i++) {
            //Draw pie slice
            var angleStart = ((2 * i / sliceCt) + rotationAdjustment) * Math.PI,
                angleEnd = ((2 * (i + 1) / sliceCt) + rotationAdjustment) * Math.PI;

            ctx.beginPath();
            ctx.moveTo(cX, cY);
            ctx.arc(cX, cY, radius, angleStart, angleEnd);
            ctx.lineTo(cX, cY);
            ctx.stroke();

            //fill pie slice color
            ctx.fillStyle = spinnerSlices[i].color;
            ctx.fill();
            ctx.save();
                        
            //set Text
            var dx = Math.floor(c.width * 0.5) - textPaddingRight;
            var dy = Math.floor(c.height * 0.05);
            ctx.translate(cX, cY);
            ctx.rotate(angleStart);
            ctx.textAlign = "right";
            ctx.fillStyle = fontColor;
            ctx.font = fontSize + "pt " + fontStyle;
            ctx.fillText(spinnerSlices[i].text, dx, dy);
            ctx.restore();

            if (((angleEnd / Math.PI) % 2) < ((angleStart / Math.PI) % 2)) { //selector in range of item
                selectedSlice = i;
            }
        }

        return selectedSlice;
    }

    export class PieSlice{
        text: string;
        color: string;
    }
} 