function tet() {
    const company = "ABC"
    const website = "abc.com"
    const location = "Hyderabad"
    const bio = "GOod Boy"
    const status = "Complte"
    const githubusername = "Adity123"
    const skills = "HTML,CSS,js"
    const user = "6788999"
    const ProfileFileds = {}
    ProfileFileds.user = user
    if (skills) {
        ProfileFileds.skills = skills.split(',').map(skill => skill.trim)
    }
    console.log(ProfileFileds)
}
tet()