package com.bloodbank.config;

import java.util.List;
import java.util.Map;

/**
 * Standard blood transfusion compatibility rules.
 * Keys = recipient blood group → Values = compatible donor blood groups,
 * ordered from closest match (prefer same type first, universal donors last)
 * to preserve rare blood types.
 */
public final class BloodCompatibilityUtil {

    private BloodCompatibilityUtil() {}

    private static final Map<String, List<String>> COMPATIBILITY = Map.of(
        "A+",  List.of("A+", "A-", "O+", "O-"),
        "A-",  List.of("A-", "O-"),
        "B+",  List.of("B+", "B-", "O+", "O-"),
        "B-",  List.of("B-", "O-"),
        "AB+", List.of("AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"),
        "AB-", List.of("AB-", "A-", "B-", "O-"),
        "O+",  List.of("O+", "O-"),
        "O-",  List.of("O-")
    );

    /**
     * Returns the ordered list of blood groups that can donate to the given recipient group.
     * First entry is always the exact match (same group).
     */
    public static List<String> getCompatibleDonorGroups(String recipientBloodGroup) {
        return COMPATIBILITY.getOrDefault(recipientBloodGroup.trim().toUpperCase()
                .replace("POSITIVE", "+").replace("NEGATIVE", "-"), List.of());
    }
}
