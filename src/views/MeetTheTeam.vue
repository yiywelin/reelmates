<template>
  <div class="main-content">
    <NavBar />
    
    <div class="theater-container">
      <TheatricalBackground />

      <div class="hero-section">
        <div class="neon-sign">
          <span class="neon-text">Meet Our Talented Team</span>
        </div>
        <p class="tagline">Get to know the faces behind ReelMates</p>
      </div>

      <div class="team-grid">
        <div 
          v-for="(member, index) in teamMembers"
          :key="index"
          class="team-card"
        >
          <div class="neon-border"></div>
          <div class="image-container">
            <img 
              :src="member.profileImage" 
              :alt="member.name" 
              class="profile-image" 
            />
            <img :src="member.hoverImage" :alt="member.name + ' Hover'" class="hover-image" />
          </div>
          <div class="text-center mt-4">
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-specialization">{{ member.specialization }}</p>
            <p class="member-role">{{ member.role }}</p>
          </div>
          <div class="neon-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/ui/NavBar.vue';
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue';

const teamMembers = [
  {
    name: "Carissa Ho Min-yi",
    specialization: "Back-end JSON Interactions",
    role: "Front-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/carrisa_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/carrisa_wide.png'),
  },
  {
    name: "Jay",
    specialization: "Front-end Developer",
    role: "Back-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/jay_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/jay_wide.png'),
  },
  {
    name: "Han Jin Guang",
    specialization: "Front-end Bootstrap Interaction",
    role: "Front-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/jinguang_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/jinguang_wide.png'),
  },
  {
    name: "Yi Ywe Lin",
    specialization: "Front-end Supervisor",
    role: "Front-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/lynn_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/lynn_wide.png'),
  },
  {
    name: "Meraaj",
    specialization: "Back-end Vue.JS",
    role: "Front-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/meraaj_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/meraaj_wide.png'),
  },
  {
    name: "Ooi Sharon",
    specialization: "Back-end Supervisor",
    role: "Front-end support",
    profileImage: require('@/assets/images/MeetTheTeam/Profile/sharon_profile.png'),
    hoverImage: require('@/assets/images/MeetTheTeam/Hover/sharon_wide.png'),
  },
];
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  background: #0A0A1F;
  margin-top: 80px; /* Adjust this value to ensure content clears the navbar */
}

.theater-container {
  min-height: calc(100vh - 70px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #D0CCE3;
  z-index: 1;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out forwards;
}

.neon-sign {
  margin-bottom: 1rem;
}

.neon-text {
  font-size: 2.5rem;
  color: #DB3DCF;
  text-shadow: 
    0 0 5px #DB3DCF,
    0 0 10px #DB3DCF,
    0 0 20px #DB3DCF;
  animation: neonFlicker 2s infinite;
}

.tagline {
  font-size: 1.2rem;
  color: #D0CCE3;
  text-shadow: 0 0 10px rgba(208, 204, 227, 0.5);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
}

.team-card {
  position: relative;
  padding: 1.5rem;
  background: rgba(60, 57, 126, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Hover effect for bounce animation */
@keyframes bounceHover {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.team-card:hover {
  animation: bounceHover 0.6s ease-in-out infinite;
  z-index: 10;
}

.neon-border {
  position: absolute;
  inset: 0;
  border: 2px solid #675FF2;
  border-radius: 12px;
  box-shadow: 0 0 10px #675FF2;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  margin-bottom: 1rem;
}

.profile-image,
.hover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.hover-image {
  opacity: 0;
}

.team-card:hover .neon-border {
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.team-card:hover .hover-image {
  opacity: 1;
}

.team-card:hover .profile-image {
  opacity: 0;
}

.text-center {
  text-align: center;
}

.member-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #675FF2;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(103, 95, 242, 0.5);
}

.member-specialization {
  font-size: 1rem;
  color: #DB3DCF;
  margin-bottom: 0.25rem;
}

.member-role {
  font-size: 0.9rem;
  color: #D0CCE3;
  opacity: 0.8;
}

@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  90% { opacity: 1; }
  95% { opacity: 0.8; }
}

/* Fade-in keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .neon-text {
    font-size: 2rem;
  }

  .tagline {
    font-size: 1rem;
  }
}
</style>
