package com.hyundai.dms.domain.role.service;

import com.hyundai.dms.common.exception.BusinessException;
import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.common.response.PageResponse;
import com.hyundai.dms.domain.menu.entity.Menu;
import com.hyundai.dms.domain.menu.repository.MenuRepository;
import com.hyundai.dms.domain.role.dto.RoleRequest;
import com.hyundai.dms.domain.role.dto.RoleResponse;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public PageResponse<RoleResponse> getAll(Pageable pageable) {
        Page<RoleResponse> page = roleRepository.findAll(pageable).map(this::toResponse);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllActive() {
        return roleRepository.findAll().stream()
                .filter(Role::isActive)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoleResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public RoleResponse create(RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new DuplicateResourceException("Role already exists: " + request.getRoleName());
        }
        Set<Menu> menus = resolveMenus(request.getMenuIds());
        Role role = Role.builder()
                .roleName(request.getRoleName().toUpperCase())
                .description(request.getDescription())
                .menus(menus)
                .build();
        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse update(Long id, RoleRequest request) {
        Role role = findById(id);
        if (!role.getRoleName().equals(request.getRoleName().toUpperCase()) &&
                roleRepository.existsByRoleName(request.getRoleName().toUpperCase())) {
            throw new DuplicateResourceException("Role already exists: " + request.getRoleName());
        }
        role.setRoleName(request.getRoleName().toUpperCase());
        role.setDescription(request.getDescription());
        if (request.getMenuIds() != null) {
            role.setMenus(resolveMenus(request.getMenuIds()));
        }
        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public void delete(Long id) {
        Role role = findById(id);
        // Prevent deactivation of ADMIN role
        if ("ADMIN".equals(role.getRoleName())) {
            throw new BusinessException("ADMIN role cannot be deactivated");
        }
        role.setActive(false);
        roleRepository.save(role);
    }

    private Role findById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", id));
    }

    private Set<Menu> resolveMenus(Set<Long> menuIds) {
        if (menuIds == null || menuIds.isEmpty()) return new HashSet<>();
        return menuIds.stream()
                .map(mid -> menuRepository.findById(mid)
                        .orElseThrow(() -> new ResourceNotFoundException("Menu", mid)))
                .collect(Collectors.toSet());
    }

    private RoleResponse toResponse(Role role) {
        RoleResponse res = new RoleResponse();
        res.setId(role.getId());
        res.setRoleName(role.getRoleName());
        res.setDescription(role.getDescription());
        res.setActive(role.isActive());
        res.setCreatedBy(role.getCreatedBy());
        res.setCreatedAt(role.getCreatedAt());
        res.setMenus(role.getMenus().stream().map(m -> {
            RoleResponse.MenuSummary ms = new RoleResponse.MenuSummary();
            ms.setId(m.getId());
            ms.setMenuCode(m.getMenuCode());
            ms.setMenuName(m.getMenuName());
            ms.setUrl(m.getUrl());
            return ms;
        }).collect(Collectors.toList()));
        return res;
    }
}
