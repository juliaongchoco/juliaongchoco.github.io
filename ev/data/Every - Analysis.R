pkgs = c("tidyverse", "lsr", "ggpubr", "ez", "pwr", "psych", "gridExtra",
         "gtools", "ggplot2", "ggbeeswarm", "GGally", "BayesFactor", "svMisc")
lapply(pkgs, require, character.only = TRUE)
rm(list = ls())

# Joan Danielle K. Ongchoco
# This code analyzes data for the Every experiments.

#### CLEAN DATA ####

# Load files
filenames = list.files(pattern=".csv")
ad = do.call("smartbind",lapply(filenames,read.csv,header=TRUE))

# Get all subjects
ad$subj_id = as.character(ad$subj_id)
included_subjects = unique(ad$subj_id[ad$test_part=='debrief'])

# Get debriefing responses
# codes = ad %>% filter(test_part == 'debrief') %>% dplyr::select(subj_id, time_elapsed, resp_attention, resp_final, completion_code)
# codes$time_elapsed = codes$time_elapsed/1000/60
# median(codes$time_elapsed)

#### GET MEANS ####

test_data = ad %>% filter(test_part=='resp_trial') %>%
  select(subj_id, freq, duration, condition, is_correct)
test_data$is_correct = as.logical(as.character(test_data$is_correct))
test_data %>% filter(condition %in% c("avg", "right", "wrong")) %>% 
                       group_by(subj_id, condition) %>% summarize(mean=mean(is_correct))

