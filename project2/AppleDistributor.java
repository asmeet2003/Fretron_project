import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class AppleDistributor {
    
    public static void main(String[] args) {
        distributeApples();
    }

    private static void distributeApples() {
        ArrayList<Integer> appleWeights = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);

        // Collect apple weights from the user
        while (true) {
            System.out.print("Enter apple weight in grams (-1 to stop): ");
            int inputWeight = scanner.nextInt();

            if (inputWeight == -1) {
                break;
            } else if (inputWeight <= 0) {
                System.out.println("Please enter a valid positive number.");
            } else {
                appleWeights.add(inputWeight);
            }
        }

        // Sort the weights in descending order
        Collections.sort(appleWeights, Collections.reverseOrder());

        final int totalAmount = 100;
        final int ramAmount = 50;
        final int shamAmount = 30;
        final int rahimAmount = 20;

        int totalWeight = appleWeights.stream().mapToInt(Integer::intValue).sum();
        int ramTargetWeight = totalWeight * ramAmount / totalAmount;
        int shamTargetWeight = totalWeight * shamAmount / totalAmount;
        int rahimTargetWeight = totalWeight * rahimAmount / totalAmount;

        ArrayList<Integer> ramWeights = new ArrayList<>();
        ArrayList<Integer> shamWeights = new ArrayList<>();
        ArrayList<Integer> rahimWeights = new ArrayList<>();

        // Distribute weights for Ram
        ramWeights = distributeFor(ramTargetWeight, appleWeights);

        // Remove distributed weights from the list
        appleWeights.removeAll(ramWeights);

        // Distribute weights for Sham
        shamWeights = distributeFor(shamTargetWeight, appleWeights);

        // Remove distributed weights from the list
        appleWeights.removeAll(shamWeights);

        // Remaining weights go to Rahim
        rahimWeights = new ArrayList<>(appleWeights);

        System.out.println("Distribution Result:");
        System.out.println("Ram: " + ramWeights);
        System.out.println("Sham: " + shamWeights);
        System.out.println("Rahim: " + rahimWeights);
    }

    private static ArrayList<Integer> distributeFor(int targetWeight, ArrayList<Integer> weights) {
        ArrayList<Integer> distributedWeights = new ArrayList<>();
        int remainingWeight = targetWeight;

        for (int i = 0; i < weights.size(); i++) {
            if (weights.get(i) <= remainingWeight) {
                distributedWeights.add(weights.get(i));
                remainingWeight -= weights.get(i);
            }
            if (remainingWeight <= 0) {
                break;
            }
        }

        return distributedWeights;
    }
}

