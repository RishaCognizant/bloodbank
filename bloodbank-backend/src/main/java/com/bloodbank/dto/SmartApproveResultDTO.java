package com.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SmartApproveResultDTO {

    /** true = request was approved and inventory deducted */
    private boolean approved;

    /** Blood group actually used to fulfil the request (may differ from requested if compatible stock used) */
    private String bloodGroupUsed;

    /** Units deducted from inventory */
    private int unitsDeducted;

    /** Reason when approved = false */
    private String reason;

    /** Blood groups that were checked (in priority order) — useful for frontend display */
    private List<String> compatibleGroupsChecked;

    /** How many registered donors were emailed asking them to donate */
    private int donorsContacted;

    /** Compatible blood groups with their stock levels for manual selection */
    private List<CompatibleStockDTO> compatibleStocks;

    /** Whether any compatible blood group has sufficient stock */
    private boolean hasSufficientStock;
}
