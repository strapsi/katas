package de.maxpower;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class SoManyPermutations {
    public static List<String> singlePermutations(String s) {
        if (s.length() == 1) return List.of(s);
        List<List<String>> permutations = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            String rest = new StringBuilder(s).deleteCharAt(i).toString();
            permutations.add(singlePermutations(rest).stream().map(it -> c + it).toList());
        }
        return permutations.stream().flatMap(Collection::stream).distinct().toList();
    }
}