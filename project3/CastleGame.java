import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

public class CastleGame {
    private static final int BOARD_SIZE = 10;
    private static final char SOLDIER = 'S';
    private static final char EMPTY = '.';

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Get number of soldiers
        int numSoldiers = getValidInteger(scanner, "Enter the number of soldiers:", 1, Integer.MAX_VALUE);
        Set<String> soldiersCoords = new HashSet<>();
        
        // Get coordinates for each soldier
        for (int i = 0; i < numSoldiers; i++) {
            while (true) {
                try {
                    String[] coords = getValidCoordinates(scanner, "Enter coordinates for soldier " + (i + 1) + " (format: x,y):");
                    int x = Integer.parseInt(coords[0]);
                    int y = Integer.parseInt(coords[1]);
                    if (isValidPosition(x, y)) {
                        soldiersCoords.add(x + "," + y);
                        break;
                    } else {
                        System.out.println("Coordinates must be within the board limits.");
                    }
                } catch (Exception e) {
                    System.out.println("Invalid input. " + e.getMessage());
                }
            }
        }
        
        // Get starting position for the special castle
        int[] startPos = null;
        while (true) {
            try {
                String[] coords = getValidCoordinates(scanner, "Enter the coordinates for your 'special' castle (format: x,y):");
                int x = Integer.parseInt(coords[0]);
                int y = Integer.parseInt(coords[1]);
                if (isValidPosition(x, y)) {
                    startPos = new int[]{x, y};
                    break;
                } else {
                    System.out.println("Coordinates must be within the board limits.");
                }
            } catch (Exception e) {
                System.out.println("Invalid input. " + e.getMessage());
            }
        }
        
        // Create the board and start the DFS
        char[][] board = createBoard(soldiersCoords);
        List<List<String>> allPaths = new ArrayList<>();
        dfs(startPos[0], startPos[1], startPos[0], startPos[1], board, new ArrayList<>(), allPaths, "right");

        // Print results
        System.out.println("Thanks. There are " + allPaths.size() + " unique paths for your 'special_castle'\n");
        for (int i = 0; i < allPaths.size(); i++) {
            List<String> path = allPaths.get(i);
            System.out.println("Path " + (i + 1) + "\n=======");
            System.out.println("Start (" + startPos[0] + "," + startPos[1] + ")");
            for (String step : path) {
                System.out.println(step);
            }
            System.out.println("Arrive (" + startPos[0] + "," + startPos[1] + ")\n");
        }
        
        scanner.close();
    }

    private static int getValidInteger(Scanner scanner, String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt + "\n");
            String input = scanner.nextLine();
            try {
                int value = Integer.parseInt(input);
                if (value >= min && value <= max) {
                    return value;
                } else {
                    System.out.println("Input must be between " + min + " and " + max + ".");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid number.");
            }
        }
    }

    private static String[] getValidCoordinates(Scanner scanner, String prompt) throws Exception {
        System.out.print(prompt + "\n");
        String input = scanner.nextLine();
        String[] coords = input.split(",");
        if (coords.length != 2) {
            throw new Exception("Input must be in the format x,y.");
        }
        return coords;
    }

    private static boolean isValidPosition(int x, int y) {
        return 0 <= x && x < BOARD_SIZE && 0 <= y && y < BOARD_SIZE;
    }

    private static char[][] createBoard(Set<String> soldiersCoords) {
        char[][] board = new char[BOARD_SIZE][BOARD_SIZE];
        for (char[] row : board) {
            for (int i = 0; i < BOARD_SIZE; i++) {
                row[i] = EMPTY;
            }
        }
        for (String coord : soldiersCoords) {
            String[] parts = coord.split(",");
            int x = Integer.parseInt(parts[0]);
            int y = Integer.parseInt(parts[1]);
            board[x][y] = SOLDIER;
        }
        return board;
    }

    private static boolean isValidMove(int x, int y, int boardSize) {
        return 0 <= x && x < boardSize && 0 <= y && y < boardSize;
    }

    private static int[] moveCastle(int x, int y, String direction, char[][] board) {
        int[] dx = {0, 1, 0, -1};
        int[] dy = {1, 0, -1, 0};
        String[] directions = {"right", "down", "left", "up"};
        int dirIndex = java.util.Arrays.asList(directions).indexOf(direction);
        int nx = x, ny = y;
        while (isValidMove(nx + dx[dirIndex], ny + dy[dirIndex], board.length)) {
            nx += dx[dirIndex];
            ny += dy[dirIndex];
            if (board[nx][ny] == SOLDIER) {
                return new int[]{nx, ny};
            }
        }
        return null;
    }

    private static void dfs(int x, int y, int startX, int startY, char[][] board, List<String> path, List<List<String>> allPaths, String direction) {
        if (x == startX && y == startY && !containsSoldier(board)) {
            allPaths.add(new ArrayList<>(path));
            return;
        }

        String[] directions = {"right", "down", "left", "up"};
        String[] newDirection = {"down", "left", "up", "right"};

        String currentDirection = direction;
        for (int i = 0; i < 4; i++) {
            int[] newPos = moveCastle(x, y, currentDirection, board);
            if (newPos != null) {
                int nx = newPos[0];
                int ny = newPos[1];
                path.add("Kill (" + nx + "," + ny + "). Turn " + newDirection[i]);
                board[nx][ny] = EMPTY;

                dfs(nx, ny, startX, startY, board, path, allPaths, newDirection[i]);

                path.remove(path.size() - 1);
                board[nx][ny] = SOLDIER;
            }
            currentDirection = newDirection[i];
        }
    }

    private static boolean containsSoldier(char[][] board) {
        for (char[] row : board) {
            for (char cell : row) {
                if (cell == SOLDIER) {
                    return true;
                }
            }
        }
        return false;
    }
}
