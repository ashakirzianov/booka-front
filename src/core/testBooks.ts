import { VolumeNode } from 'booka-common';

// cspell:disable

export const short: VolumeNode = {
    'node': 'volume',
    'nodes': [
        {
            'node': 'chapter',
            'nodes': [{
                'span': 'compound',
                'spans': [
                    'Lorem ipsum ',
                    {
                        'span': 'attrs',
                        'content': 'dolor sit amet',
                        attrs: ['italic'],
                    },
                    ', consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed velit dignissim sodales ut eu sem. Ornare arcu dui vivamus arcu felis bibendum. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Cursus turpis massa tincidunt dui ut. At quis risus sed vulputate odio ut. In fermentum et sollicitudin ac orci phasellus egestas. Et netus et malesuada fames. Egestas sed tempus urna et pharetra pharetra. Nunc sed id semper risus in hendrerit gravida rutrum quisque. Semper feugiat nibh sed pulvinar proin. Vitae turpis massa sed elementum tempus egestas sed sed risus.',
                ],
            },
                'Euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Eget sit amet tellus cras adipiscing enim eu. Accumsan tortor posuere ac ut consequat semper viverra nam. Enim neque volutpat ac tincidunt. Bibendum neque egestas congue quisque egestas. Pellentesque pulvinar pellentesque habitant morbi. Id porta nibh venenatis cras sed felis eget velit. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Nunc eget lorem dolor sed. Fermentum et sollicitudin ac orci phasellus. Morbi tristique senectus et netus et malesuada. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur. Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Condimentum id venenatis a condimentum. Dui vivamus arcu felis bibendum ut tristique. Libero volutpat sed cras ornare arcu dui vivamus. Faucibus purus in massa tempor nec feugiat nisl pretium. Imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor. Aliquam etiam erat velit scelerisque in dictum. Duis convallis convallis tellus id interdum.',
            ],
            'title': [
                'Short title',
            ],
            'level': 2,
        },
    ],
    'meta': {
        'title': 'Lorem',
        'author': 'John Smith',
    },
};
