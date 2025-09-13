<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Hacksphere Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration values specific to the Hacksphere event
    | such as submission deadlines, evaluation criteria weights, and other settings.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Submission Settings
    |--------------------------------------------------------------------------
    */
    
    // Project submission deadline (format: Y-m-d H:i:s)
    'submission_deadline' => env('HACKSPHERE_SUBMISSION_DEADLINE', '2025-10-04 12:00:00'),
    
    /*
    |--------------------------------------------------------------------------
    | Evaluation Criteria Weights
    |--------------------------------------------------------------------------
    */
    
    'evaluation_weights' => [
        'whole_system_functionality_score' => 0.30, // 30%
        'ui_ux_design_score' => 0.20,              // 20%
        'backend_logic_score' => 0.25,             // 25%
        'ai_model_performance_score' => 0.15,      // 15%
        'automation_integration_score' => 0.10,    // 10%
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Evaluation TKT Levels
    |--------------------------------------------------------------------------
    */
    
    'evaluation_tkt_levels' => [
        'whole_system_functionality_score' => 'TKT 6',
        'ui_ux_design_score' => 'TKT 5-6',
        'backend_logic_score' => 'TKT 6',
        'ai_model_performance_score' => 'TKT 5-6',
        'automation_integration_score' => 'TKT 6',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Evaluation Criteria Descriptions
    |--------------------------------------------------------------------------
    */
    
    'evaluation_descriptions' => [
        'whole_system_functionality_score' => 'Apakah sistem menyatu dan dapat digunakan sesuai konteks kasus PT. Kereta Api Indonesia (KAI)?',
        'ui_ux_design_score' => 'Apakah antar muka ramah pengguna, intuitif, dan profesional?',
        'backend_logic_score' => 'Apakah logika sistem berjalan stabil, efisien, dan fleksibel?',
        'ai_model_performance_score' => 'Apakah AI/ML digunakan secara tepat dan menghasilkan output relevan?',
        'automation_integration_score' => 'Apakah terdapat komponen otomasi atau chatbot yang real-time dan terhubung dengan sistem lain?',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Team Size Limits
    |--------------------------------------------------------------------------
    */
    
    'min_team_members' => 3,
    'max_team_members' => 5,
];
