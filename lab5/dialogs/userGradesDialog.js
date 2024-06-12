// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {
    AttachmentPrompt,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    ChoiceFactory
} = require('botbuilder-dialogs');
const { UserProfile } = require('../userProfile');
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class UserGradesDialog extends ComponentDialog {
    constructor(userState) {
        super('userGradesDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.subjectStep.bind(this),
            this.gradeStep.bind(this),
            this.summaryStep.bind(this),
            this.confirmStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async nameStep(step) {
        return await step.prompt(NAME_PROMPT, 'Введіть своє ім\'я');
    }

    async subjectStep(step) {
        step.values.name = step.result;
        await step.context.sendActivity(`Вітаємо, ${ step.result }!`);
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Оберіть дисципліну',
            choices: ChoiceFactory.toChoices([
                'ОБДЗ',
                'Вступ до ІПЗ',
                'ЛМВ'
            ])
        });
    }

    async gradeStep(step) {
        step.values.subject = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Поставте оцінку викладачеві від 1 до 5',
            choices: ChoiceFactory.toChoices(['1', '2', '3', '4', '5'])
        });
    }

    async summaryStep(step) {
        const userProfile = await this.userProfile.get(step.context, new UserProfile());

        userProfile.name = step.values.name;
        userProfile.subject = step.values.subject.value;
        userProfile.grade = step.result.value;
        console.log(userProfile);

        const msg = `Ваше ім'я - ${ userProfile.name }. Ви поставили оцінку "${ userProfile.grade }" викладачеві з предмета "${ userProfile.subject }".`;
        /*   if (userProfile.age !== -1) {
            msg += ` and your age as ${ userProfile.age }`;
        } */

        await step.context.sendActivity(msg);
        return await step.prompt(CONFIRM_PROMPT, { prompt: 'Зберегти дані?' });
    }

    async confirmStep(step) {
        let msg = 'Дякуємо.';
        if (step.result) {
            msg += ' Ваш відгук збережено. Дякуємо за Вашу позицію.';
        } else {
            msg += ' Ваш відгук не збережено.';
        }

        await step.context.sendActivity(msg);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.endDialog();
    }
}

module.exports.UserGradesDialog = UserGradesDialog;
