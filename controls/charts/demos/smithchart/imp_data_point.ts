/**
 * Default sample for smith chart
 */
import { Smithchart } from '../../src/smithchart/smithchart';

let smithchart: Smithchart = new Smithchart({
    
    series: [
        {
            points: [
                { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 },
            ],
            name: 'Transmission1',
           
        }, {
            points: [
                { resistance: 20, reactance: -50 }, { resistance: 10, reactance: -10 },
                { resistance: 9, reactance: -4.5 }, { resistance: 8, reactance: -3.5 },
                { resistance: 7, reactance: -2.5 }, { resistance: 6, reactance: -1.5 },
                { resistance: 5, reactance: -1 }, { resistance: 4.5, reactance: -0.5 },
                { resistance: 3.5, reactance: 0 }, { resistance: 2.5, reactance: 0.4 },
                { resistance: 2, reactance: 0.5 }, { resistance: 1.5, reactance: 0.5 },
                { resistance: 1, reactance: 0.4 }, { resistance: 0.5, reactance: 0.2 },
                { resistance: 0.3, reactance: 0.1 }, { resistance: 0, reactance: 0.05 },
            ],
            name: 'Transmission2',
        },
        {
            points: [
                { resistance: 20, reactance: -51 }, { resistance: 10, reactance: -15 },
                { resistance: 9, reactance: -4.7 }, { resistance: 8, reactance: -3.9 },
                { resistance: 7, reactance: -2.9 }, { resistance: 6, reactance: -1.3 },
                { resistance: 5, reactance: -1.8 }, { resistance: 4.5, reactance: -0.2 },
                { resistance: 3.5, reactance: 0.9 }, { resistance: 2.5, reactance: 0.1 },
                { resistance: 2, reactance: 5 }, { resistance: 1.5, reactance: 0.9 },
                { resistance: 1, reactance: 0 }, { resistance: 0.5, reactance: 0.6 },
                { resistance: 0.3, reactance: 0.5 }, { resistance: 0, reactance: 0.08 },
            ],
            name: 'Transmission3',
        },
        {
            points: [
                { resistance: 20, reactance: -61 }, { resistance: 10, reactance: -11 },
                { resistance: 9, reactance: -5.7 }, { resistance: 8, reactance: -3 },
                { resistance: 7, reactance: -3.9 }, { resistance: 6, reactance: -1 },
                { resistance: 5, reactance: -2.8 }, { resistance: 4.5, reactance: -0.5 },
                { resistance: 3.5, reactance: 1.9 }, { resistance: 2.5, reactance: 0.3 },
                { resistance: 2, reactance: 5.2 }, { resistance: 1.5, reactance: 0.4 },
                { resistance: 1, reactance: 0.3 }, { resistance: 0.5, reactance: 0.3 },
                { resistance: 0.3, reactance: 0 }, { resistance: 0, reactance: 0.04 },
            ],
            name: 'Transmission4',
        },
        {
            points: [
                { resistance: 20, reactance: -31 }, { resistance: 10, reactance: -19 },
                { resistance: 9, reactance: -5.4 }, { resistance: 8, reactance: -3.9 },
                { resistance: 7, reactance: -3.0 }, { resistance: 6, reactance: -1.8 },
                { resistance: 5, reactance: -2.0 }, { resistance: 4.5, reactance: -0.9 },
                { resistance: 3.5, reactance: 1.3 }, { resistance: 2.5, reactance: 0.1 },
                { resistance: 2, reactance: 5.5 }, { resistance: 1.5, reactance: 0.2 },
                { resistance: 1, reactance: 0.9 }, { resistance: 0.5, reactance: 0.4 },
                { resistance: 0.3, reactance: 0.9 }, { resistance: 0, reactance: 0.05 },
            ],
            name: 'Transmission4',
        },
    ]

});
smithchart.appendTo('#container');
