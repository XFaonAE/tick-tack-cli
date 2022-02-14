import CommandLine, { Anime } from '@nexojs/command-line';
import readline from 'readline';

export default class TickTac extends Anime {
    #currentMousePosition: { x: number, y: number } = { x: 0, y: 0 };

    #currentPlayer = 1;

    #gameBoard: [
        number, number, number,
        number, number, number,
        number, number, number,
    ] = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ];

    public constructor() {
        super();

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => {
            if (key.name === 'c' && key.ctrl) {
                process.exit(0);
            }

            if (key.name === 'up') {
                this.#currentMousePosition.y -= 1;
                if (this.#currentMousePosition.y < 0) {
                    this.#currentMousePosition.y = 0;
                }
            } else if (key.name === 'down') {
                this.#currentMousePosition.y += 1;
                if (this.#currentMousePosition.y > 2) {
                    this.#currentMousePosition.y = 2;
                }
            } else if (key.name === 'left') {
                this.#currentMousePosition.x -= 1;
                if (this.#currentMousePosition.x < 0) {
                    this.#currentMousePosition.x = 0;
                }
            } else if (key.name === 'right') {
                this.#currentMousePosition.x += 1;
                if (this.#currentMousePosition.x > 2) {
                    this.#currentMousePosition.x = 2;
                }
            } else if (key.name === 'space' || key.name === 'return') {
                const index = this.#currentMousePosition.x + this.#currentMousePosition.y * 3;
                const gameBoarCurr = this.#gameBoard[index];

                if (gameBoarCurr === 0) {
                    this.#gameBoard[index] = this.#currentPlayer;
                    this.#currentPlayer = this.#currentPlayer === 1 ? 2 : 1;
                }
            }

            this.#render();

            const checkWin = (playerNumber: 1 | 2) => {
                const winingPoss = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],

                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],

                    [0, 4, 8],
                    [2, 4, 6],
                ];

                let win = false;

                winingPoss.forEach((poss) => {
                     if (
                        this.#gameBoard[poss[0]] === playerNumber &&
                        this.#gameBoard[poss[1]] === playerNumber &&
                        this.#gameBoard[poss[2]] === playerNumber
                    ) {
                        win = true;
                    }
                });

                return win;
            }

            if (checkWin(1)) {
                console.log("Player 1 wins!");
                process.exit(0);
            } else if (checkWin(2)) {
                console.log("Player 2 wins!");
                process.exit(0);
            } else if (this.#gameBoard.filter((value) => value === 0).length === 0) {
                console.log("It's a draw!");
                process.exit(0);
            }
        });

        this.#render();
    }

    #render() {
        const getRowNumber = (index: number) => {
            if ([0, 1, 2].includes(index)) {
                return 0;
            }

            if ([3, 4, 5].includes(index)) {
                return 1;
            }

            if ([6, 7, 8].includes(index)) {
                return 2;
            }
        };

        const getColumnNumber = (index: number) => {
            if ([0, 3, 6].includes(index)) {
                return 0;
            }

            if ([1, 4, 7].includes(index)) {
                return 1;
            }

            if ([2, 5, 8].includes(index)) {
                return 2;
            }
        };

        const getPiece = (index: number) => {
            const value = this.#gameBoard[index];
            const indexRow = getRowNumber(index);
            const indexColumn = getColumnNumber(index);

            let result = ' ';

            if (value === 1) {
                result = 'X';
            }

            if (value === 2) {
                result = 'O';
            }

            if (indexColumn === this.#currentMousePosition.x && indexRow === this.#currentMousePosition.y) {
                result = CommandLine.color.underline(result);

                return result;
            }

            return result;
        };

        const lines = [
            '   Tick Tac Toe  CLI   -------------------',
            `   ${getPiece(0)}   ${getPiece(1)}   ${getPiece(2)}   |`,
            `   ${getPiece(3)}   ${getPiece(4)}   ${getPiece(5)}   |`,
            `   ${getPiece(6)}   ${getPiece(7)}   ${getPiece(8)}   |`,
            `   ------------`
        ];

        this.renderLines(lines);
    }
}
