// This script will be compiled into the JS bundle automatically.
import { UnitTable } from "./booking";


document.addEventListener("DOMContentLoaded", function() {
    // Unit booking table
    const unitTableContainer = document.getElementById("unit-table")
    if (unitTableContainer) {
        const unitTable = new UnitTable("#unit-table");
    }
});