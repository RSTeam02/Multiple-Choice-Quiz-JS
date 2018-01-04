import { JSONFileReader } from "./jsonfilereader.js";
import { View } from "./view.js";

export class Controller {
    constructor() {
        this.reader = new JSONFileReader();
        this.view = new View()
        this.refreshOutput();
        this.btnListener();
    }

    btnListener() {
        $(".cbox").on('click', () => {
            this.refreshOutput();
        });
    }

    refreshOutput(){
        let rndSwitch = {
            question: ($('#qShuffle').is(':checked')) ? true : false,
            answer: ($('#aShuffle').is(':checked')) ? true : false
        };
        this.reader.readJSON(rndSwitch, (res) => {
            this.view.printAll(res);
        });
    }

}