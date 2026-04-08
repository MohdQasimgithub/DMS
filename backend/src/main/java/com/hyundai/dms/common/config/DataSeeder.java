package com.hyundai.dms.common.config;

import com.hyundai.dms.domain.config.entity.AppConfig;
import com.hyundai.dms.domain.config.repository.AppConfigRepository;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.menu.entity.Menu;
import com.hyundai.dms.domain.menu.repository.MenuRepository;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MenuRepository menuRepository;
    private final DealerRepository dealerRepository;
    private final VehicleRepository vehicleRepository;
    private final AppConfigRepository configRepository;
    private final PasswordEncoder passwordEncoder;

    // ── master data ──────────────────────────────────────────────────────────
    private static final String[][] REGIONS = {
        {"Seoul",   "Seoul"},   {"Busan",    "Busan"},
        {"Incheon", "Incheon"}, {"Daegu",    "Daegu"},
        {"Gwangju", "Gwangju"}, {"Daejeon",  "Daejeon"},
        {"Ulsan",   "Ulsan"},   {"Suwon",    "Gyeonggi"},
        {"Goyang",  "Gyeonggi"},{"Changwon", "Gyeongnam"},
        {"Jeonju",  "Jeonbuk"}, {"Cheongju", "Chungbuk"},
        {"Pohang",  "Gyeongbuk"},{"Jeju",    "Jeju"}
    };

    private static final String[][] MODELS = {
        {"IONIQ 6",   new String[]{"Standard Range","Long Range RWD","Long Range AWD"}[0],
                      "Standard Range"},
        {"IONIQ 5",   "Standard Range", "Long Range RWD"},
        {"Tucson",    "Petrol 2.0",     "Hybrid"},
        {"Santa Fe",  "Petrol 2.5",     "Hybrid"},
        {"Sonata",    "Petrol 2.0",     "Hybrid"},
        {"Elantra",   "Petrol 1.6",     "N Line"},
        {"Kona",      "Petrol 1.0T",    "Electric"},
        {"Palisade",  "Petrol 3.8",     "Diesel 2.2"},
        {"Staria",    "Petrol 3.5",     "Diesel 2.2"},
        {"Venue",     "Petrol 1.0T",    "Petrol 1.6"},
    };

    private static final String[] VARIANTS_IONIQ6  = {"Standard Range","Long Range RWD","Long Range AWD"};
    private static final String[] VARIANTS_IONIQ5  = {"Standard Range","Long Range RWD","Long Range AWD"};
    private static final String[] VARIANTS_TUCSON  = {"Petrol 2.0","Diesel 2.0","Hybrid","PHEV"};
    private static final String[] VARIANTS_SANTAFE = {"Petrol 2.5","Diesel 2.2","Hybrid","PHEV"};
    private static final String[] VARIANTS_SONATA  = {"Petrol 2.0","Hybrid","N Line"};
    private static final String[] VARIANTS_ELANTRA = {"Petrol 1.6","Hybrid","N Line"};
    private static final String[] VARIANTS_KONA    = {"Petrol 1.0T","Petrol 1.6","Electric"};
    private static final String[] VARIANTS_PALISADE= {"Petrol 3.8","Diesel 2.2"};
    private static final String[] VARIANTS_STARIA  = {"Petrol 3.5","Diesel 2.2"};
    private static final String[] VARIANTS_VENUE   = {"Petrol 1.0T","Petrol 1.6"};

    private static final String[] COLORS = {
        "Phantom Black","Ceramic White","Gravity Gold Matte","Nocturne Blue",
        "Digital Teal","Cyber Grey","Atlas White","Shooting Star",
        "Magnetic Force","Shimmering Silver","Serenity White","Sonic Blue",
        "Abyss Black","Moonlight Cloud","Stormy Sea","Performance Blue"
    };

    private static final String[] FIRST_NAMES = {
        "Kim","Lee","Park","Choi","Jung","Kang","Yoon","Lim",
        "Han","Oh","Shin","Kwon","Jang","Hong","Ko","Moon",
        "Bae","Ryu","Ahn","Song","Nam","Hwang","Seo","Jeon"
    };
    private static final String[] LAST_NAMES = {
        "Jae-won","Min-jun","Soo-yeon","Hyun-soo","Da-eun","Ji-ho",
        "Tae-yang","Bo-ra","Cheol-su","Na-ra","Seung-hwan","Hye-jin",
        "Dong-hyun","Ji-yeon","Sang-woo","Mi-rae","Joon-ho","Ye-jin",
        "Woo-jin","So-yeon","Byung-chul","Eun-ji","Kyung-min","Ha-eun"
    };

    @Override
    @Transactional
    public void run(String... args) {
        seedMenus();
        seedRoles();
        seedUsers();
        seedDealers();
        seedVehicles();
        seedConfigs();
        log.info("✅ Seeding done — users:{}, dealers:{}, vehicles:{}",
                userRepository.count(), dealerRepository.count(), vehicleRepository.count());
    }

    // ── MENUS ────────────────────────────────────────────────────────────────

    private void seedMenus() {
        if (menuRepository.count() > 0) return;
        Menu dash  = m("DASHBOARD","Dashboard","/dashboard","dashboard",1,null);
        Menu deal  = m("DEALERS","Dealers","/dealers","store",2,null);
        Menu veh   = m("VEHICLES","Vehicles","/vehicles","directions_car",3,null);
        Menu adm   = m("ADMIN","Administration",null,"admin_panel_settings",4,null);
        m("USERS","Users","/admin/users","people",1,adm);
        m("ROLES","Roles","/admin/roles","security",2,adm);
        m("MENUS","Menus","/admin/menus","menu",3,adm);
        m("CONFIGS","Configurations","/admin/configs","settings",4,adm);
        m("LOGS","Logs","/admin/logs","article",5,adm);
        log.info("Menus seeded.");
    }

    private Menu m(String code,String name,String url,String icon,int order,Menu parent){
        return menuRepository.save(Menu.builder()
                .menuCode(code).menuName(name).url(url).icon(icon)
                .sortOrder(order).parent(parent).build());
    }

    // ── ROLES ────────────────────────────────────────────────────────────────

    private void seedRoles() {
        if (roleRepository.count() > 0) return;
        List<Menu> all      = menuRepository.findAll();
        List<Menu> limited  = all.stream()
                .filter(x -> List.of("DASHBOARD","DEALERS","VEHICLES").contains(x.getMenuCode()))
                .toList();

        roleRepository.save(Role.builder().roleName("ADMIN")
                .description("Full system access").menus(Set.copyOf(all)).build());
        roleRepository.save(Role.builder().roleName("DEALER")
                .description("Dealer — manage own dealership & vehicles")
                .menus(Set.copyOf(limited)).build());
        roleRepository.save(Role.builder().roleName("EMPLOYEE")
                .description("Employee — sales & support staff")
                .menus(Set.copyOf(limited)).build());
        log.info("Roles seeded: ADMIN, DEALER, EMPLOYEE");
    }

    // ── USERS  (50 users) ────────────────────────────────────────────────────

    private void seedUsers() {
        if (userRepository.count() > 0) return;
        Role admin    = roleRepository.findByRoleName("ADMIN").orElseThrow();
        Role dealer   = roleRepository.findByRoleName("DEALER").orElseThrow();
        Role employee = roleRepository.findByRoleName("EMPLOYEE").orElseThrow();

        List<User> users = new ArrayList<>();

        // 1 admin
        users.add(User.builder().username("admin")
                .email("admin@hyundai-autoever.com")
                .password(passwordEncoder.encode("Admin@1234"))
                .fullName("System Administrator").phoneNumber("01012345678")
                .roles(Set.of(admin)).build());

        // 20 dealers
        for (int i = 1; i <= 20; i++) {
            String fn = FIRST_NAMES[i % FIRST_NAMES.length];
            String ln = LAST_NAMES[i % LAST_NAMES.length];
            users.add(User.builder()
                    .username("dealer_" + String.format("%02d", i))
                    .email("dealer" + i + "@hyundai-dealer.com")
                    .password(passwordEncoder.encode("Dealer@1234"))
                    .fullName(fn + " " + ln)
                    .phoneNumber("010" + String.format("%08d", 10000000 + i))
                    .roles(Set.of(dealer)).build());
        }

        // 25 employees
        for (int i = 1; i <= 25; i++) {
            String fn = FIRST_NAMES[(i + 5) % FIRST_NAMES.length];
            String ln = LAST_NAMES[(i + 5) % LAST_NAMES.length];
            users.add(User.builder()
                    .username("emp_" + String.format("%02d", i))
                    .email("employee" + i + "@hyundai-autoever.com")
                    .password(passwordEncoder.encode("Employee@1234"))
                    .fullName(fn + " " + ln)
                    .phoneNumber("010" + String.format("%08d", 20000000 + i))
                    .roles(Set.of(employee)).build());
        }

        // 4 multi-role users (dealer + employee)
        for (int i = 1; i <= 4; i++) {
            users.add(User.builder()
                    .username("mgr_" + String.format("%02d", i))
                    .email("manager" + i + "@hyundai.com")
                    .password(passwordEncoder.encode("Manager@1234"))
                    .fullName("Manager " + LAST_NAMES[i])
                    .phoneNumber("010" + String.format("%08d", 30000000 + i))
                    .roles(Set.of(dealer, employee)).build());
        }

        userRepository.saveAll(users);
        log.info("Users seeded: {} total", users.size());
    }

    // ── DEALERS  (50 dealers) ────────────────────────────────────────────────

    private void seedDealers() {
        if (dealerRepository.count() > 0) return;
        List<Dealer> dealers = new ArrayList<>();

        String[] streets = {
            "Gangnam-daero","Teheran-ro","Sejong-daero","Jongno","Eulji-ro",
            "Dobong-ro","Haeundae-ro","Sasang-ro","Airport-ro","Dongseong-ro",
            "Chungjang-ro","Dunsan-ro","Taehwa-ro","Jungang-ro","Bupyeong-ro"
        };
        String[] managers = {
            "Kim Jae-won","Park Min-jun","Lee Soo-yeon","Choi Hyun-soo","Jung Da-eun",
            "Kang Ji-ho","Yoon Tae-yang","Lim Bo-ra","Han Cheol-su","Oh Na-ra",
            "Shin Seung-hwan","Kwon Hye-jin","Jang Dong-hyun","Hong Ji-yeon","Ko Sang-woo"
        };
        Dealer.DealerStatus[] statuses = {
            Dealer.DealerStatus.ACTIVE, Dealer.DealerStatus.ACTIVE,
            Dealer.DealerStatus.ACTIVE, Dealer.DealerStatus.ACTIVE,
            Dealer.DealerStatus.INACTIVE, Dealer.DealerStatus.SUSPENDED
        };

        // Use a global sequential number for unique dealer codes
        int globalSeq = 1;

        for (String[] region : REGIONS) {
            String city = region[0];
            String reg  = region[1];
            int count   = (reg.equals("Seoul") || reg.equals("Gyeonggi")) ? 6 : 3;

            for (int i = 1; i <= count; i++) {
                // Globally unique code: HYD-001, HYD-002, ...
                String code    = String.format("HYD-%03d", globalSeq);
                String street  = streets[(globalSeq - 1) % streets.length];
                String manager = managers[(globalSeq - 1) % managers.length];
                Dealer.DealerStatus status = statuses[(globalSeq - 1) % statuses.length];

                dealers.add(Dealer.builder()
                        .dealerCode(code)
                        .dealerName("Hyundai " + city + " " + suffix(i))
                        .address(globalSeq * 10 + " " + street + ", " + city)
                        .city(city).region(reg)
                        .phone("0" + (2 + globalSeq % 8) + String.format("%07d", globalSeq))
                        .email(city.toLowerCase().replaceAll("\\s+","") + i + "@hyundai-dealer.com")
                        .managerName(manager)
                        .status(status)
                        .build());
                globalSeq++;
            }
        }

        dealerRepository.saveAll(dealers);
        log.info("Dealers seeded: {}", dealers.size());
    }

    private String suffix(int i) {
        return switch (i) {
            case 1 -> "Central";  case 2 -> "North";   case 3 -> "South";
            case 4 -> "East";     case 5 -> "West";     default -> "Premium";
        };
    }

    // ── VEHICLES  (200+ vehicles) ────────────────────────────────────────────

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;
        List<Dealer> dealers = dealerRepository.findAll();
        List<Vehicle> vehicles = new ArrayList<>();

        // model → variants, base price
        record ModelSpec(String model, String[] variants, long basePrice) {}
        List<ModelSpec> specs = List.of(
            new ModelSpec("IONIQ 6",  VARIANTS_IONIQ6,   38_000_000L),
            new ModelSpec("IONIQ 5",  VARIANTS_IONIQ5,   42_000_000L),
            new ModelSpec("Tucson",   VARIANTS_TUCSON,   27_000_000L),
            new ModelSpec("Santa Fe", VARIANTS_SANTAFE,  38_000_000L),
            new ModelSpec("Sonata",   VARIANTS_SONATA,   24_000_000L),
            new ModelSpec("Elantra",  VARIANTS_ELANTRA,  20_000_000L),
            new ModelSpec("Kona",     VARIANTS_KONA,     22_000_000L),
            new ModelSpec("Palisade", VARIANTS_PALISADE, 50_000_000L),
            new ModelSpec("Staria",   VARIANTS_STARIA,   40_000_000L),
            new ModelSpec("Venue",    VARIANTS_VENUE,    18_000_000L)
        );

        Vehicle.VehicleStatus[] statuses = Vehicle.VehicleStatus.values();
        int vinSeq = 1;

        for (ModelSpec spec : specs) {
            // ~22 vehicles per model = ~220 total
            for (int i = 0; i < 22; i++) {
                String variant = spec.variants()[i % spec.variants().length];
                String color   = COLORS[i % COLORS.length];
                int year       = 2022 + (i % 3);   // 2022, 2023, 2024
                long priceAdj  = spec.basePrice() + (long)(i % spec.variants().length) * 3_000_000L;
                Vehicle.VehicleStatus status = statuses[i % statuses.length];
                Dealer dealer  = dealers.get(i % dealers.size());

                String vin = String.format("KMHC041DBNU%06d", vinSeq++);

                vehicles.add(Vehicle.builder()
                        .vin(vin)
                        .model(spec.model())
                        .variant(variant)
                        .color(color)
                        .modelYear(year)
                        .price(BigDecimal.valueOf(priceAdj))
                        .status(status)
                        .dealer(dealer)
                        .build());
            }
        }

        vehicleRepository.saveAll(vehicles);
        log.info("Vehicles seeded: {}", vehicles.size());
    }

    // ── CONFIGS ──────────────────────────────────────────────────────────────

    private void seedConfigs() {
        if (configRepository.count() > 0) return;
        configRepository.saveAll(List.of(
            cfg("MAX_LOGIN_ATTEMPTS",      "5",                          "SECURITY", "Max failed attempts before lock"),
            cfg("SESSION_TIMEOUT_MINUTES", "30",                         "SECURITY", "JWT session timeout (minutes)"),
            cfg("PASSWORD_MIN_LENGTH",     "8",                          "SECURITY", "Minimum password length"),
            cfg("ITEMS_PER_PAGE",          "10",                         "UI",       "Default pagination size"),
            cfg("DATE_FORMAT",             "yyyy-MM-dd",                 "UI",       "Display date format"),
            cfg("CURRENCY",                "KRW",                        "UI",       "Default currency"),
            cfg("APP_NAME",                "Hyundai AutoEver DMS",       "SYSTEM",   "Application display name"),
            cfg("APP_VERSION",             "1.0.0",                      "SYSTEM",   "Application version"),
            cfg("SUPPORT_EMAIL",           "support@hyundai-autoever.com","SYSTEM",  "Support contact email"),
            cfg("MAINTENANCE_MODE",        "false",                      "SYSTEM",   "Toggle maintenance mode")
        ));
        log.info("Configs seeded.");
    }

    private AppConfig cfg(String key, String val, String group, String desc) {
        boolean editable = !"APP_VERSION".equals(key);
        return AppConfig.builder()
                .configKey(key).configValue(val)
                .configGroup(group).description(desc)
                .editable(editable).build();
    }
}
