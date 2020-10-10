/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { interfaces } from 'inversify';
import {
    createPreferenceProxy, PreferenceProxy, PreferenceService, PreferenceContribution, PreferenceSchema,
    PreferenceModificationContribution
    // , PreferenceSchemaModification
} from '@theia/core/lib/browser';

export const GitConfigSchema: PreferenceSchema = {
    'type': 'object',
    'properties': {
        'git.decorations.enabled': {
            'type': 'boolean',
            'description': 'Show Git file status in the navigator.',
            'default': true
        },
        'git.decorations.colors': {
            'type': 'boolean',
            'description': 'Use color decoration in the navigator.',
            'default': false
        },
        'git.editor.decorations.enabled': {
            'type': 'boolean',
            'description': 'Show git decorations in the editor.',
            'default': true
        },
        'git.editor.dirtyDiff.linesLimit': {
            'type': 'number',
            'description': 'Do not show dirty diff decorations, if editor\'s line count exceeds this limit.',
            'default': 1000
        },
        'git.alwaysSignOff': {
            'type': 'boolean',
            'description': 'Always sign off commits.',
            'default': false
        }
    }
};

// : PreferenceSchemaModification
export const TestSchemaMods = {
    'type': 'object',
    properties: {
        'workbench.list.openMode': {
            // type: 'string',
            // enum: [
            //     'singleClick',
            //     'doubleClick'
            // ],
            // default: 'singleClick',
            // description: 'Controls how to open items in trees using the mouse.'
            default: 'doubleClick',
        },
        'workbench.editor.highlightModifiedTabs': {
            // 'type': 'boolean',
            // 'description': 'Controls whether a top border is drawn on modified (dirty) editor tabs or not.',
            // 'default': false
            hidden: true,
        },
        'application.confirmExit': {
            // type: 'string',
            // enum: [
            //     'never',
            //     'ifRequired',
            //     'always',
            // ],
            // default: 'ifRequired',
            // description: 'When to confirm before closing the application window.',
            enum: [
                'ifRequired',
                'always',
            ],
        },
        'workbench.commandPalette.history': {
            // type: 'number',
            // default: 50,
            // minimum: 0,
            // description: 'Controls the number of recently used commands to keep in history for the command palette. Set to 0 to disable command history.'
            minimum: 10,
        },
        'workbench.colorTheme': {
            // type: 'string',
            // default: FrontendApplicationConfigProvider.get().defaultTheme,
            // description: 'Specifies the color theme used in the workbench.'
            description: 'Another description about specifying the color theme used in the workbench.'
        },
        // 'workbench.iconTheme': {
        //     type: ['string', 'null'],
        //     default: FrontendApplicationConfigProvider.get().defaultIconTheme,
        //     description: "Specifies the icon theme used in the workbench or 'null' to not show any file icons."
        // },
        // 'workbench.silentNotifications': {
        //     type: 'boolean',
        //     default: false,
        //     description: 'Controls whether to suppress notification popups.'
        // },
        // 'files.encoding': {
        //     'type': 'string',
        //     'enum': Object.keys(SUPPORTED_ENCODINGS),
        //     'default': 'utf8',
        //     'description': 'The default character set encoding to use when reading and writing files. This setting can also be configured per language.',
        //     'scope': 'language-overridable',
        //     'enumDescriptions': Object.keys(SUPPORTED_ENCODINGS).map(key => SUPPORTED_ENCODINGS[key].labelLong),
        //     'included': Object.keys(SUPPORTED_ENCODINGS).length > 1
        // },
        'workbench.tree.renderIndentGuides': {
            // type: 'string',
            // enum: ['onHover', 'none', 'always'],
            // default: 'onHover',
            // description: 'Controls whether the tree should render indent guides.'
            enumDescriptions: ['hover bother', 'no, not ever', 'all the time, please'],
        }
    }
};

export interface GitConfiguration {
    'git.decorations.enabled': boolean,
    'git.decorations.colors': boolean,
    'git.editor.decorations.enabled': boolean,
    'git.editor.dirtyDiff.linesLimit': number,
    'git.alwaysSignOff': boolean
}

export const GitPreferences = Symbol('GitPreferences');
export type GitPreferences = PreferenceProxy<GitConfiguration>;

export function createGitPreferences(preferences: PreferenceService): GitPreferences {
    return createPreferenceProxy(preferences, GitConfigSchema);
}

export function bindGitPreferences(bind: interfaces.Bind): void {
    bind(GitPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get<PreferenceService>(PreferenceService);
        return createGitPreferences(preferences);
    });
    bind(PreferenceContribution).toConstantValue({ schema: GitConfigSchema });
    bind(PreferenceModificationContribution).toConstantValue({ schemaModification: TestSchemaMods });
}
