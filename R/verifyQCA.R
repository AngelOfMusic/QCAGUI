`verify.data` <-
function(data, outcome = "", conditions = "") {
    
     # check if the data is a data.frame
    if (!is.data.frame(data)) {
        cat("\n")
        stop("The input data should be a data frame.\n\n", call. = FALSE)
    }
    
    
     # check if the data has column names
    if (is.null(colnames(data))) {
        cat("\n")
        stop("Please specify the column names for your data.\n\n", call. = FALSE)
    }
    
     # check the outcome specified by the user
     
    if (identical(outcome, "")) {
        cat("\n")
        stop("The outcome set is not specified.\n\n", call. = FALSE)
    }
    
    if (! outcome %in% colnames(data)) {
        cat("\n")
        stop("The name of the outcome is not correct.\n\n", call. = FALSE)
    }
    
    
    if (!identical(conditions, "")) {
        if (outcome %in% conditions) {
            cat("\n")
            stop('Variable "', outcome, '" cannot be both outcome _and_ condition!\n\n', call. = FALSE)
        }
        
        if (!all(conditions %in% names(data))) {
            cat("\n")
            stop("The conditions' names are not correct.\n\n", call. = FALSE)
        }
        
        if (length(conditions) == 1) {
            cat("\n")
            stop("Cannot find a solution with only one causal condition.\n\n", call. = FALSE)
        }
    }
    
    # checking for complete data (without missings)
    if (any(is.na(data))) {
        checked <- sapply(data, function(x) any(is.na(x)))
        cat("\n")
        stop(paste("Missing values in the data are not allowed. Please check columns:\n",
             paste(names(checked)[checked], collapse = ", "), "\n\n", sep=""), call. = FALSE)
    }
    
}



`verify.qca` <-
function(data) {
    
    # determine if it's a dataframe
    
    if (is.data.frame(data)) {
        if (is.null(colnames(data))) {
            cat("\n")
            stop("The dataset doesn't have any columns names.\n\n", call. = FALSE)
        }
        
        # determine if it's a valid QCA dataframe
        checkNumUncal <- lapply(data, function(x) {
            # making sure it's not a temporal QCA column
            x <- setdiff(x, c("-", "dc", "?"))
            pn <- possibleNumeric(x)
            
            uncal <- FALSE
            
            if (pn) {
                y <- asNumeric(x)
                if (any(y > 1 & abs(y - round(y)) >= .Machine$double.eps^0.5)) {
                    uncal <- TRUE
                }
            }
            
            return(c(pn, uncal))
        })
        
        checknumeric <- sapply(checkNumUncal, "[[", 1)
        checkuncal <- sapply(checkNumUncal, "[[", 2)
        
        if (!all(checknumeric)) {
            cat("\n")
            notnumeric <- colnames(data)[!checknumeric]
            errmessage <- paste("The causal condition",
                                ifelse(length(notnumeric) == 1, " ", "s "),
                                paste(notnumeric, collapse=", "),
                                ifelse(length(notnumeric) == 1, " is ", " are "),
                                "not numeric.", sep="")
            stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), "\n\n", call. = FALSE)
        }
        
        if (any(checkuncal)) {
            cat("\n")
            uncalibrated <- colnames(data)[uncalibrated]
            errmessage <- paste("Uncalibrated data.\n",
            "Fuzzy sets should have values bound to the interval [0 , 1] and all other values should be crisp.\n",
            "Please check the following condition", ifelse(length(uncalibrated) == 1, "", "s"), ":\n",
            paste(uncalibrated, collapse = ", "), sep="")
            stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
        }
                   
    }
    else if (is.vector(data)) {
        if (!possibleNumeric(data)) {
            cat("\n")
            stop("Non numeric input.\n\n", call. = FALSE)
        }
    }
}


`verify.tt` <-
function(data, outcome = "", conditions = "", complete = FALSE, show.cases = FALSE, incl.cut1 = 1, incl.cut0 = 1, inf.test) {
    
    if (class(data) != "data.frame") {
        cat("\n")
        errmessage <- paste("You have to provide a data frame, the current \"data\" argument contains an object\n",
                   "       of class \"", class(data), "\"",
                   ifelse(class(data) == "sS", ", created by superSubset()", ""),
                   ifelse(class(data) == "tt", ", created by truthTable()", ""),
                   ifelse(class(data) == "pof", ", created by pof()", ""),
                   ".\n\n", sep="")
        stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""))
    }
    
    if (is.tt(data)) {
        data <- data$initial.data
    }
    
    if (identical(outcome, "")) {
        cat("\n")
        stop("You haven't specified the outcome set.\n\n", call. = FALSE)
    }
    
    if (! outcome %in% colnames(data)) {
        cat("\n")
        stop("The outcome's name is not correct.\n\n", call. = FALSE)
    }
    
    if (!identical(conditions, "")) {
        
        if (length(conditions) == 1 & is.character(conditions)) {
            conditions <- splitstr(conditions)
        }
        
        if (outcome %in% conditions) {
            cat("\n")
            stop('Variable "', outcome, '" cannot be both outcome _and_ condition!\n\n', call. = FALSE)
        }
        
        if (!all(conditions %in% names(data))) {
            cat("\n")
            stop("The conditions' names are not correct.\n\n", call. = FALSE)
        }
        
        if (length(conditions) == 1) {
            cat("\n")
            stop("Cannot find a solution with only one causal condition.\n\n", call. = FALSE)
        }
    }
    else {
        conditions <- colnames(data)
        conditions <- conditions[conditions != outcome]
    }
    
    # checking for complete data (without missings)
    if (any(is.na(data))) {
        checked <- sapply(data, function(x) any(is.na(x)))
        cat("\n")
        stop(paste("Missing values in the data are not allowed. Please check columns:\n",
             paste(names(checked)[checked], collapse = ", "), "\n\n", sep=""), call. = FALSE)
    }
    
    
    # checking for the two including cut-offs
    if (any(c(incl.cut1, incl.cut0) < 0) | any(c(incl.cut1, incl.cut0) > 1)) {
        cat("\n")
        stop("The including cut-off(s) should be bound to the interval [0, 1].\n\n", call. = FALSE)
    }
    
    if (incl.cut0 > incl.cut1 & incl.cut0 < 1) {
        cat("\n")
        stop("incl.cut0 cannot be greater than incl.cut1.\n\n", call. = FALSE)
    }
    
    data <- data[, c(conditions, outcome)]
    
    data <- as.data.frame(lapply(data, function(x) {
        x <- as.character(x)
        x[x %in% c("-", "dc", "?")] <- -1
        return(asNumeric(x))
    }))
    
    verify.qca(data)
    verify.inf.test(inf.test, data)
}


`verify.eqmcc` <-
function(data, outcome = "", conditions = "", explain = "",
         include = "", use.letters = FALSE) {

    verify.data(data, outcome = outcome, conditions = conditions)
    
     # check if the user specifies something to explain
    if (all(explain == "")) {
        cat("\n")
        stop("You have not specified what to explain.\n\n", call. = FALSE)
    }
    
     # check if the user specifies something to explain
    if (!all(explain %in% c(0, 1, "C"))) {
        cat("\n")
        stop("You should explain either 0, 1, or \"C\".\n\n", call. = FALSE)
    }
    
    chexplain <- c(0, 1)[which(0:1 %in% explain)]
    chinclude <- c(0, 1)[which(0:1 %in% include)]
    if (length(chinclude) > 0) {
        if (any(chinclude != chexplain)) {
            chinclude <- chinclude[which(chinclude != chexplain)]
            cat("\n")
            errmessage <- paste("You cannot include ", chinclude, " since you want to explain ", chexplain, ".\n\n", sep="")
            stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
        }
    }
    
     # check if explain has both 1 and 0
    if (length(chexplain) == 2) {
        cat("\n")
        stop("Combination to be explained not allowed.\n\n", call. = FALSE)
    }
    
    if (!all(include %in% c("?", "0", "1", "C"))) {
        cat("\n")
        errmessage <- "You can only include one or more of the following: \"?\", \"C\", \"0\" and \"1\".\n\n"
        stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
    }
    
    
     # subset the data with the conditions specified
    if (!identical(conditions, "")) {
        
        if (length(conditions) == 1 & is.character(conditions)) {
            conditions <- splitstr(conditions)
        }
        
        if (outcome %in% conditions) {
            cat("\n")
            stop(paste0("Variable \"", outcome, "\" cannot be both outcome _and_ condition!\n\n"), call. = FALSE)
        }
        
        if (!all(conditions %in% names(data))) {
            cat("\n")
            stop("The conditions' names are not correct.\n\n", call. = FALSE)
        }
        
        if (length(conditions) == 1) {
            cat("\n")
            stop("Cannot find a solution with only one causal condition.\n\n", call. = FALSE)
        }
    }
    
    
     # if more than 26 conditions (plus one outcome), we cannot use letters
    if (use.letters & ncol(data) > 27) {
        cat("\n")
        stop("Cannot use letters. There are more than 26 conditions.\n\n", call. = FALSE)
    }
    
    # checking for complete data (without missings)
    if (any(is.na(data))) {
        checked <- sapply(data, function(x) any(is.na(x)))
        cat("\n")
        stop(paste("Missing values in the data are not allowed. Please check columns:\n",
             paste(names(checked)[checked], collapse = ", "), "\n\n", sep=""), call. = FALSE)
    }
}



`verify.dir.exp` <-
function(data, outcome, conditions, dir.exp = "") {
    
    # checking the directional expectations
    if (identical(dir.exp, "")) {
        return(dir.exp)
    }
    else {
        
        # delc is dir.exp.list.complete
        delc <- vector("list", length = length(conditions))
        names(delc) <- conditions
        
        for (i in seq(length(delc))) {
            # sometimes a condition cand have 0, 1 and "-" as values
            # see RagStr$EBA, which is also treated as a factor by default, in R
            
            values <- sort(unique(data[, conditions[i]]))
            if (is.factor(values)) {
                values <- as.character(values)
            }
            
            max.value <- values[length(values)]
            
            if (max.value != "-") {
                delc[[i]] <- rep(0, length(seq(0, as.numeric(max.value))))
                names(delc[[i]]) <- seq(0, as.numeric(max.value))
            }
        }
        
        if (length(dir.exp) == 1 & is.character(dir.exp)) {
            dir.exp <- splitstr(dir.exp)
        }
        
        if (length(dir.exp) != length(conditions)) {
            cat("\n")
            stop("Number of expectations does not match number of conditions.\n\n", call. = FALSE)
        }
        
        # del is dir.exp.list
        del <- strsplit(as.character(dir.exp), split=";")
        
        if (!is.null(names(dir.exp))) {
            if (length(names(dir.exp)) != length(conditions)) {
                cat("\n")
                stop("All directional expectations should have names, or none at all.\n\n", call. = FALSE)
            }
            else if (length(setdiff(names(dir.exp), conditions)) > 0) {
                cat("\n")
                stop("Incorect names of the directional expectations.\n\n", call. = FALSE)
            }
            names(del) <- names(dir.exp)
            del <- del[conditions]
        }
        else {
            names(del) <- conditions
        }
        
        for (i in seq(length(del))) {
            
            values <- strsplit(del[[i]], split = "")
            values <- unlist(lapply(values, function(x) {
                paste(x[x != " "], collapse = "")
            }))
            
            if (all(values %in% c("-", "dc"))) {
                delc[[i]] <- -1
            }
            else {
                values <- setdiff(values, c("-", "dc"))
                if (length(setdiff(values, names(delc[[i]])) > 0)) {
                    cat("\n")
                    errmessage <- paste("Values specified in the directional expectations do not appear in the data, for condition \"", conditions[i], "\".\n\n", sep="")
                    stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
                }
                else {
                    delc[[i]][as.character(values)] <- 1
                }
            }
        }
        return(delc)
    }
}





`verify.mqca` <-
function(data, outcome = "", conditions = c("")) {
    
    mvoutcome <- grepl("[{]", outcome) # there is a "{" sign in the outcome names
    outcome.value <- rep(-1, length(outcome))
    
    if (any(mvoutcome)) {
        outcome.copy <- outcome
        
        outcome.copy <- strsplit(outcome.copy, split = "")
        outcome.name <- outcome.value <- vector(mode="list", length=length(outcome))
        
        for (i in seq(length(outcome.copy))) {
            if (mvoutcome[i]) {
                outcome.value[[i]] <- as.numeric(outcome.copy[[i]][which(outcome.copy[[i]] == "{") + 1])
                outcome.name[[i]] <- paste(outcome.copy[[i]][seq(1, which(outcome.copy[[i]] == "{") - 1)], collapse="")
            }
            else {
                outcome.value[[i]] <- -1
                outcome.name[[i]] <- outcome[i]
            }
        }
        
        outcome <- unlist(outcome.name)
        
        if (length(intersect(outcome, names(data))) < length(outcome)) {
            outcome <- setdiff(outcome, names(data))
            cat("\n")
            errmessage <- paste("Outcome(s) not present in the data: \"", paste(outcome, collapse="\", \""), "\".\n\n", sep="")
            stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
        }
        
        for (i in seq(length(outcome))) {
            if (mvoutcome[i]) {
                if (!any(unique(data[, outcome.name[[i]]]) == outcome.value[[i]])) {
                    cat("\n")
                    errmessage <- paste("The value {", outcome.value[[i]], "} does not exist in the outcome \"", outcome.name[[i]], "\".\n\n", sep="")
                    stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
                }
            }
        }
        
        outcome.value <- unlist(outcome.value)
    }
    else {
        
        if (length(intersect(outcome, names(data))) < length(outcome)) {
            outcome <- setdiff(outcome, names(data))
            cat("\n")
            errmessage <- paste("Outcome(s) not present in the data: \"", paste(outcome, collapse="\", \""), "\".\n\n", sep="")
            stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
        }
        
        fuzzy.outcome <- apply(data[, outcome, drop=FALSE], 2, function(x) any(x %% 1 > 0))
        
        # Test if outcomes are in fact multi-valent, even if the user did not specify that 
        if (any(!fuzzy.outcome)) {
            outcome.copy <- outcome[!fuzzy.outcome]
            
            for (i in outcome.copy) {
                valents <- unique(data[, i])
                if (!all(valents %in% c(0, 1))) {
                    cat("\n")
                    errmessage <- paste("Please specify the value of outcome variable \"", i, "\" to explain.\n\n", sep = "")
                    stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
                }
            }
        }
        
    }
    
    if (identical(conditions, c(""))) {
        conditions <- names(data)
    }
    
    if (length(setdiff(outcome, conditions)) > 0) {
        outcome <- setdiff(outcome, conditions)
        cat("\n")
        errmessage <- paste("Outcome(s) not present in the conditions' names: \"", paste(outcome, collapse="\", \""), "\".\n\n", sep="")
        stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
    }
    
    invisible(return(list(mvoutcome = mvoutcome, outcome = outcome, outcome.value = outcome.value, conditions = conditions)))
    
}




`verify.inf.test` <- function(inf.test, data) {
    if (all(inf.test != "")) {
        if (inf.test[1] != "binom") {
            cat("\n")
            stop("For the moment only \"binom\"ial testing for crisp data is allowed.\n\n", call. = FALSE)
        }
        else {
            fuzzy <- apply(data, 2, function(x) any(x %% 1 > 0))
            if (any(fuzzy)) {
                cat("\n")
                errmessage <- "The binomial test only works with crisp data.\n\n"
                stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
            }
        }
        
        if (length(inf.test) > 1) {
            alpha <- as.numeric(inf.test[2])
            if (is.na(alpha) | alpha < 0 | alpha > 1) {
                cat("\n")
                errmessage <- "The second value of inf.test should be a number between 0 and 1.\n\n"
                stop(paste(strwrap(errmessage, exdent = 7), collapse = "\n", sep=""), call. = FALSE)
            }
        }
    }
}


