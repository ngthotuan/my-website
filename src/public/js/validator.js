// struct: form > ...form-group > [...input, error]
// ...: optional
function Validator(options) {
    const selectorRules = {};

    const formElement = document.querySelector(options.form);
    const rules = options.rules;

    // support input in multiple div
    function getParentElement(element, parentSelector) {
        while (element) {
            if (element.parentElement.matches(parentSelector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function addErrorMessage(inputElement, errorElement, errorMessage) {
        if (inputElement.type !== 'checkbox' && inputElement.type !== 'radio') {
            inputElement.classList.add(options.invalidClass);
        }
        errorElement.innerText = errorMessage;
    }

    function removeErrorMessage(inputElement, errorElement) {
        inputElement.classList.remove(options.invalidClass);
        errorElement.innerText = '';
    }

    // validate function
    function validate(inputElement, errorElement, rule) {
        let errorMessage;

        // get list rules of rule => test
        const rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(
                            `input[name=${inputElement.name}]:checked`,
                        ),
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value); //call test function
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            addErrorMessage(inputElement, errorElement, errorMessage);
        } else {
            removeErrorMessage(inputElement, errorElement);
        }

        return !errorMessage;
    }

    // Validate business
    if (formElement && rules) {
        // get rules + add even on user input & blur
        rules.forEach((rule) => {
            // put rules to selectorRules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            // Get input element from selector
            const inputElements = formElement.querySelectorAll(rule.selector); // all for radio checkbox

            inputElements.forEach((inputElement) => {
                const errorElement = getParentElement(
                    inputElement,
                    options.formGroupSelector,
                ).querySelector(options.errorSelector);

                inputElement.onblur = () => {
                    validate(inputElement, errorElement, rule);
                };
                inputElement.oninput = () => {
                    removeErrorMessage(inputElement, errorElement);
                };
            });
        });

        // when submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            let isFormValid = true;

            rules.forEach((rule) => {
                //validate each rule
                const inputElement = formElement.querySelector(rule.selector);
                const errorElement = getParentElement(
                    inputElement,
                    options.formGroupSelector,
                ).querySelector(options.errorSelector);

                if (inputElement) {
                    if (!validate(inputElement, errorElement, rule)) {
                        isFormValid = false;
                    }
                }
            });

            if (isFormValid) {
                // get user input
                const inputs = formElement.querySelectorAll(
                    '[name]:not([disabled]):not([readonly])',
                );
                const formValues = Array.from(inputs).reduce(
                    (values, input) => {
                        switch (input.type) {
                            case 'radio':
                                if (!input.matches(':checked')) return values;
                                values[input.name] = formElement.querySelector(
                                    `input[name="${input.name}"]:checked`,
                                ).value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) return values;
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    },
                    {},
                );

                if (typeof options.onSubmit === 'function') {
                    // defined onSubmit function
                    options.onSubmit(formValues);
                } else {
                    // submit default
                    formElement.submit();
                }
            }
        };
    }
}

// rules
// error ? error message : undefined
Validator.isRequired = function (selector, message) {
    return {
        selector,
        test(value) {
            return value ? undefined : message || 'Please input this field';
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector,
        test(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase())
                ? undefined
                : message || 'This field required email address';
        },
    };
};

Validator.minLength = function (selector, minLength, message) {
    return {
        selector,
        test(value) {
            return value.length >= minLength
                ? undefined
                : message || `Please input at least ${minLength} characters`;
        },
    };
};

Validator.maxLength = function (selector, maxLength, message) {
    return {
        selector,
        test(value) {
            return value.length <= maxLength
                ? undefined
                : message || `Please input maximum ${maxLength} characters`;
        },
    };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector,
        test(value) {
            return value === getConfirmValue()
                ? undefined
                : message || 'Value confirmed is not correct';
        },
    };
};
