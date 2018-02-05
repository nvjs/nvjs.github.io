var vn = new vnjs();

vn.setResource({
    type: 'sprites',
    name: 'Monika',
    src: 'res/3a.png'
});

vn.setResource({
    type: 'sprites',
    name: 'Monika_b',
    src: 'res/3b.png'
});

vn.setResource({
    type: 'bg',
    name: 'school',
    src: 'res/club-skill.png'
});

vn.setResource({
    type: 'bgm',
    name: 'daily',
    src: 'res/daily.mp3'
});

vn.start(() => {
    vn.bgm('daily');
    vn.bg('school');

    vn.sprite('Monika_b');
    vn.text('Monika', 'Hi! I\'m Monika.');
    vn.text('Monika', 'How are you?');
    vn.text('Я', 'Nice.');
    vn.sprite('Monika');
    vn.text('Monika', 'I\'m fine!');

    vn.render();
});